import AbstractAttribute from "./AbstractAttribute";
import AttributeListeners from "./AttributeListeners";
import AttributeIdentity from "./Interfaces/AttributeIdentity";

/**
 * elements
 * if input has type and type == type time week
 * then it will set the value to a new date of the value
 *
 *
 * ex:
 * "child:value:queryselector"
 * or
 * "child:text:queryselector"
 * or
 * "child:attributeName:queryselector"
 *
 *
 * @export
 * @class FMDefaultAttribute
 * @extends {FMAttribute}
 * @implements {FMAClearInterface}
 * @implements {FMAFormInitInterface}
 */
export default class IgnoreAttribute
extends AbstractAttribute {
	public trigger(_: AttributeListeners, data?: any): boolean | void | object {
		data[this.input.getName()] = undefined
		return data
	}

	public static listeners: AttributeListeners[] = [
		AttributeListeners.FORM_SUBMIT
	]

	public static identity: AttributeIdentity = {
		attribute: IgnoreAttribute,
		dataElement: "data-ignore"
	}
}
