import InputAbstract from "../../modules/AbstractInput";
import AbstractAttribute from "../AbstractAttribute";
import AttributeListeners from "../AttributeListeners";
import AttributeIdentity from "./AttributeIdentity";

/**
 * Define static elements of `AttributeAbstract`
 */
export default interface AttributeInterface {
	new(input: InputAbstract): AbstractAttribute
	listeners: AttributeListeners[]
	identity: AttributeIdentity
}
