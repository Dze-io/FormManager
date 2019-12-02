import AttributeAbstract from "./AttributeAbstract";
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
extends AttributeAbstract {
	public trigger(event: AttributeListeners, data?: any): boolean | void | object {
		console.log("pouetemon")
		data[this.input.getName()] = undefined
		console.log(data)
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
