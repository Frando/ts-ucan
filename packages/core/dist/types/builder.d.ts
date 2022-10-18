import Plugins from "./plugins.js";
import { BuilderI, BuildableState, DefaultableState } from "./types.js";
declare type BuilderConstructor = {
    new <State extends Partial<BuildableState>>(state: State, defaultable: DefaultableState): BuilderI<State>;
    create(): BuilderI<Record<string, never>>;
};
/**
 * A builder API for UCANs.
 *
 * Supports grabbing UCANs from a UCAN `Store` for proofs (see `delegateCapability`).
 *
 * Example usage:
 *
 * ```ts
 * const ucan = await Builder.create()
 *   .issuedBy(aliceKeypair)
 *   .toAudience(bobDID)
 *   .withLifetimeInSeconds(30)
 *   .claimCapability({ email: "my@email.com", cap: "SEND" })
 *   .delegateCapability(emailSemantics, { email: "my-friends@email.com", cap: "SEND" }, proof)
 *   .build()
 * ```
 */
declare const mkBuilderClass: (plugins: Plugins) => BuilderConstructor;
export default mkBuilderClass;
