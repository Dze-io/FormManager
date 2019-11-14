import InputAbstract from "../../modules/InputAbstract";
import AttributeAbstract from "../AttributeAbstract";
import AttributeListeners from "../AttributeListeners";
import AttributeIdentity from "./AttributeIdentity";

/**
 * Define static elements of `AttributeAbstract`
 */
export default interface AttributeInterface {
	new(input: InputAbstract): AttributeAbstract
	listeners: AttributeListeners[]
	identity: AttributeIdentity
}
