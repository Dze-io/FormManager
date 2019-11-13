import FMAttribute, { FMAttributeListeners, FMAttributeAssignment, TriggerCallback } from "../FMAttribute";
import { evalF } from "../Functions";

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
export default class FMAutosetAttribute
extends FMAttribute {
	public trigger(ev: FMAttributeListeners, datas?: any): void {
		console.log("pouet")
		let str = this.input.element.getAttribute("data-autoset") || ""
		if (evalF(str, (ster) => {this.input.setValue(ster)})) return
		this.normal(str)
		// console.log(p)
	}

	private normal(str: string) {
		const regexp = new RegExp("{([a-zA-Z0-9]+)}")
		let loopMax = 0
		while (regexp.test(str) && loopMax++ < 10) {
			const el = regexp.exec(str || "")
			if (el === null) {
				break
			}
			str = str.replace(new RegExp(el[0], "g"), this.input.form.getJSON()[el[1]])
		}
		this.input.setValue(str)
		if (loopMax >= 10) {
			throw new Error("Error, too many differents variables");
		}
	}

	public static listeners: FMAttributeListeners[] = [
		FMAttributeListeners.CHANGE,
		FMAttributeListeners.FORM_FILL
	]
}

export const FMAutosetAttributeAssignment: FMAttributeAssignment = {
	attribute: FMAutosetAttribute,
	dataElement: "data-autoset"
}
