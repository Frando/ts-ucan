import * as uint8arrays from "uint8arrays"
import * as util from "./util"
import * as did from "./did"
import { verifySignatureUtf8 } from "./did/validation"
import { Keypair, KeyType, Capability, Fact, Ucan, UcanHeader, UcanPayload, UcanParts, isUcanHeader, isUcanPayload } from "./types"

/**
 * Create a UCAN, User Controlled Authorization Networks, JWT.
 * This JWT can be used for authorization.
 *
 * ### Header
 *
 * `alg`, Algorithm, the type of signature.
 * `typ`, Type, the type of this data structure, JWT.
 * `ucv`, UCAN version.
 *
 * ### Payload
 *
 * `aud`, Audience, the ID of who it's intended for.
 * `exp`, Expiry, unix timestamp of when the jwt is no longer valid.
 * `fct`, Facts, an array of extra facts or information to attach to the jwt.
 * `iss`, Issuer, the ID of who sent this.
 * `nbf`, Not Before, unix timestamp of when the jwt becomes valid.
 * `nnc`, Nonce, a randomly generated string, used to ensure the uniqueness of the jwt.
 * `prf`, Proofs, nested tokens with equal or greater privileges.
 * `att`, Attenuation, a list of resources and capabilities that the ucan grants.
 *
 */

export async function build(params: {
  // from/to
  issuer: Keypair
  audience: string

  // capabilities
  capabilities?: Array<Capability>

  // time bounds
  lifetimeInSeconds?: number // expiration overrides lifetimeInSeconds
  expiration?: number
  notBefore?: number

  // proofs / other info
  facts?: Array<Fact>
  proofs?: Array<string>
  addNonce?: boolean

  // in the weeds
  ucanVersion?: string
}): Promise<Ucan> {
  const keypair = params.issuer
  const didStr = did.publicKeyBytesToDid(keypair.publicKey, keypair.keyType)
  const { header, payload } = buildParts({
    ...params,
    issuer: didStr,
    keyType: keypair.keyType
  })
  return sign(header, payload, keypair)
}

export function buildParts(params: {
  // from/to
  keyType: KeyType
  issuer: string
  audience: string

  // capabilities
  capabilities?: Array<Capability>

  // time bounds
  lifetimeInSeconds?: number // expiration overrides lifetimeInSeconds
  expiration?: number
  notBefore?: number

  // proofs / other info
  facts?: Array<Fact>
  proofs?: Array<string>
  addNonce?: boolean

  // in the weeds
  ucanVersion?: string
}): UcanParts {
  const {
    keyType,
    issuer,
    audience,
    capabilities = [],
    lifetimeInSeconds = 30,
    expiration,
    notBefore,
    facts,
    proofs = [],
    addNonce = false,
    ucanVersion = "0.7.0"
  } = params

  // Timestamps
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const exp = expiration || (currentTimeInSeconds + lifetimeInSeconds)
  const nbf = notBefore || currentTimeInSeconds - 60

  const header = {
    alg: jwtAlgorithm(keyType),
    typ: "JWT",
    ucv: ucanVersion,
  } as UcanHeader

  const payload = {
    aud: audience,
    att: capabilities,
    exp,
    fct: facts,
    iss: issuer,
    nbf,
    prf: proofs,
  } as UcanPayload

  if (addNonce) {
    payload.nnc = util.generateNonce()
  }

  return { header, payload }
}

/**
 * Encode a UCAN.
 *
 * @param ucan The UCAN to encode
 */
export function encode(ucan: Ucan): string {
  const encodedHeader = encodeHeader(ucan.header)
  const encodedPayload = encodePayload(ucan.payload)

  return encodedHeader + "." +
         encodedPayload + "." +
         ucan.signature
}

/**
 * Encode the header of a UCAN.
 *
 * @param header The UcanHeader to encode
 */
 export function encodeHeader(header: UcanHeader): string {
  return uint8arrays.toString(uint8arrays.fromString(JSON.stringify(header), "utf8"), "base64url")
}

/**
 * Encode the payload of a UCAN.
 *
 * @param payload The UcanPayload to encode
 */
export function encodePayload(payload: UcanPayload): string {
  return uint8arrays.toString(uint8arrays.fromString(JSON.stringify(payload), "utf8"), "base64url")
}

/**
 * Check if a UCAN is expired.
 *
 * @param ucan The UCAN to validate
 */
export function isExpired(ucan: Ucan): boolean {
  return ucan.payload.exp <= Math.floor(Date.now() / 1000)
}

/**
 * Check if a UCAN is not active yet.
 *
 * @param ucan The UCAN to validate
 */
export const isTooEarly = (ucan: Ucan): boolean => {
  if (ucan.payload.nbf == null) {
    return false
  }
  return ucan.payload.nbf > Math.floor(Date.now() / 1000)
}


export interface ValidateOptions {
  checkSignature?: boolean
  checkIsExpired?: boolean
  checkIsTooEarly?: boolean
}

/**
 * Parse & Validate **one layer** of a UCAN.
 * This doesn't validate attenutations and doesn't validate the whole UCAN chain.
 * 
 * By default, this will check the signature and time bounds.
 * 
 * @param encodedUcan the JWT-encoded UCAN to validate
 * @param options an optional parameter to configure turning off some validation options
 * @returns the parsed & validated UCAN (one layer)
 * @throws Error if the UCAN is invalid
 */
export async function validate(encodedUcan: string, options?: ValidateOptions): Promise<Ucan> {
  const checkSignature = options?.checkSignature ?? true
  const checkIsExpired = options?.checkIsExpired ?? true
  const checkIsTooEarly = options?.checkIsTooEarly ?? true

  const [encodedHeader, encodedPayload, signature] = encodedUcan.split(".")
  if (encodedHeader == null || encodedPayload == null || signature == null) {
    throw new Error(`Can't parse UCAN: ${encodedUcan}: Expected JWT format: 3 dot-separated base64url-encoded values.`)
  }

  const headerDecoded = parseHeader(encodedHeader)
  const payloadDecoded = parsePayload(encodedPayload)

  const { header, payload } = handleCompatibility(headerDecoded, payloadDecoded)

  if (checkSignature) {
    if (!await verifySignatureUtf8(`${encodedHeader}.${encodedPayload}`, signature, payload.iss)) {
      throw new Error(`Invalid UCAN: ${encodedUcan}: Signature invalid.`)
    }
  }

  const ucan: Ucan = { header, payload, signature }

  if (checkIsExpired && isExpired(ucan)) {
    throw new Error(`Invalid UCAN: ${encodedUcan}: Expired.`)
  }

  if (checkIsTooEarly && isTooEarly(ucan)) {
    throw new Error(`Invalid UCAN: ${encodedUcan}: Not active yet (too early).`)
  }

  return ucan
}

export function parseHeader(encodedUcanHeader: string): unknown {
  let decodedUcanHeader: string
  try {
    decodedUcanHeader = uint8arrays.toString(uint8arrays.fromString(encodedUcanHeader, "base64url"), "utf8")
  } catch {
    throw new Error(`Can't parse UCAN header: ${encodedUcanHeader}: Can't parse as base64url.`)
  }

  try {
    return JSON.parse(decodedUcanHeader)
  } catch {
    throw new Error(`Can't parse UCAN header: ${encodedUcanHeader}: Can't parse base64url encoded JSON inside.`)
  }
}

export function parsePayload(encodedUcanPayload: string): unknown {
  let decodedUcanPayload: string
  try {
    decodedUcanPayload = uint8arrays.toString(uint8arrays.fromString(encodedUcanPayload, "base64url"), "utf8")
  } catch {
    throw new Error(`Can't parse UCAN payload: ${encodedUcanPayload}: Can't parse as base64url.`)
  }

  try {
    return JSON.parse(decodedUcanPayload)
  } catch {
    throw new Error(`Can't parse UCAN payload: ${encodedUcanPayload}: Can't parse base64url encoded JSON inside.`)
  }
}

type UcanHeader_0_0_1 = {
  alg: string
  typ: string
  uav: string
}

type UcanPayload_0_0_1 = {
  iss: string
  aud: string
  nbf?: number
  exp: number
  rsc: string
  ptc: string
  prf?: string
}

function isUcanHeader_0_0_1(obj: unknown): obj is UcanHeader_0_0_1 {
  return util.isRecord(obj)
    && util.hasProp(obj, "alg") && typeof obj.alg === "string"
    && util.hasProp(obj, "typ") && typeof obj.typ === "string"
    && util.hasProp(obj, "uav") && typeof obj.uav === "string"
}

function isUcanPayload_0_0_1(obj: unknown): obj is UcanPayload_0_0_1 {
  return util.isRecord(obj)
    && util.hasProp(obj, "iss") && typeof obj.iss === "string"
    && util.hasProp(obj, "aud") && typeof obj.aud === "string"
    && (!util.hasProp(obj, "nbf") || typeof obj.nbf === "number")
    && util.hasProp(obj, "exp") && typeof obj.exp === "number"
    && util.hasProp(obj, "rsc") && typeof obj.rsc === "string"
    && util.hasProp(obj, "ptc") && typeof obj.ptc === "string"
    && (!util.hasProp(obj, "prf") || (Array.isArray(obj.prf) && obj.prf.every(proof => typeof proof === "string")))
}


function handleCompatibility(header: unknown, payload: unknown): UcanParts {
  const fail = (place: string, reason: string) => new Error(`Can't parse UCAN ${place}: ${reason}`)
  
  if (!util.isRecord(header)) throw fail("header", "Invalid format: Expected a record")

  // parse either the "ucv" or "uav" as a version in the header
  // we translate 'uav: 1.0.0' into 'ucv: 0.0.1'
  // we only support versions 0.7.0 and 0.0.1
  let version: "0.7.0" | "0.0.1" = "0.7.0"
  if (!util.hasProp(header, "ucv") || typeof header.ucv !== "string") {
    if (!util.hasProp(header, "uav") || typeof header.uav !== "string") {
      throw fail("header", "Invalid format: Missing version indicator")
    } else if (header.uav !== "1.0.0") {
      throw fail("header", `Unsupported version 'uav: ${header.uav}'`)
    }
    version = "0.0.1"
  } else if (header.ucv !== "0.7.0") {
    throw fail("header", `Unsupported version 'ucv: ${header.ucv}'`)
  }

  if (version === "0.7.0") {
    if (!isUcanHeader(header)) throw fail("header", "Invalid format")
    if (!isUcanPayload(payload)) throw fail("payload", "Invalid format")
    return { header, payload }
  }

  // we know it's version 0.0.1

  if (!isUcanHeader_0_0_1(header)) throw fail("header", "Invalid version 0.0.1 format")
  if (!isUcanPayload_0_0_1(payload)) throw fail("payload", "Invalid version 0.0.1 format")

  return {
    header: {
      alg: header.alg,
      typ: header.typ,
      ucv: "0.0.1",
    },
    payload: {
      iss: payload.iss,
      aud: payload.aud,
      nbf: payload.nbf,
      exp: payload.exp,
      att: [{
        rsc: payload.rsc,
        cap: payload.ptc,
      }],
      prf: payload.prf != null ? [payload.prf] : []
    }
  }
}


/**
 * Generate UCAN signature.
 */
export async function sign(header: UcanHeader, payload: UcanPayload, key: Keypair): Promise<Ucan> {
  return addSignature(header, payload, (data) => key.sign(data))
}

export async function addSignature(header: UcanHeader, payload: UcanPayload, signFn: (data: Uint8Array) => Promise<Uint8Array>): Promise<Ucan> {
  const encodedHeader = encodeHeader(header)
  const encodedPayload = encodePayload(payload)

  const toSign = uint8arrays.fromString(`${encodedHeader}.${encodedPayload}`, "utf8")
  const sig = await signFn(toSign)

  return {
    header,
    payload,
    signature: uint8arrays.toString(sig, "base64url")
  }
}

// ㊙️


/**
 * JWT algorithm to be used in a JWT header.
 */
function jwtAlgorithm(keyType: KeyType): string | null {
  switch (keyType) {
    case "ed25519": return "EdDSA"
    case "rsa": return "RS256"
    default: return null
  }
}
