import FMAttribute, { FMAttributeListeners, FMAttributeAssignment, TriggerCallback } from "../FMAttribute";

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
export default class FMIgnoreAttribute
extends FMAttribute {
	public trigger(ev: FMAttributeListeners, datas?: any): TriggerCallback {
		console.log("pouetemon")
		datas[this.input.getName()] = undefined
		console.log(datas)
		return {
			datas,
			result: true
		}
	}

	public static listeners: FMAttributeListeners[] = [
		FMAttributeListeners.FORM_SUBMIT
	]
}

export const FMIgnoreAttributeAssignment: FMAttributeAssignment = {
	attribute: FMIgnoreAttribute,
	dataElement: "data-ignore"
}
