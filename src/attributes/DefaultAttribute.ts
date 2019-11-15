import { evalF } from "../Functions";
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
export default class DefaultAttribute
extends AttributeAbstract {
	public trigger(event: AttributeListeners, data?: any): boolean | void | object {
		this.run()
		return true
	}

	private run() {
		let attrVal = this.input.element.getAttribute("data-default")

		// if element has a date,time,week type
		let type = this.input.element.getAttribute("type") || ""
		if (type === "date" || type === "time" || type === "week") {
			this.input.setValue(attrVal !== "" && attrVal !== null ? new Date(attrVal): new Date())
			return
		}

		if (!attrVal) {
			this.input.setValue(attrVal)
			return
		}

		if (evalF(attrVal, (str) => this.input.setValue(str))) {
			return
		}

		// rest
		if (attrVal && attrVal.startsWith("child:")) {
			let splitted = attrVal.split(":", 3)
			if (splitted.length !== 3) throw Error(`Error: "${this.input.getName()}" data-default starts with child: but is not a three part sequence!`)

			// get child
			let el = this.input.element.querySelector(splitted[2])
			if (!el) throw Error(`Error: "${this.input.getName()}" child not found!`)

			// if default is a text
			if (splitted[1] === "text") return this.input.setValue(el.textContent)

			// if default is a value
			if (splitted[1] === "value") return this.input.setValue((el as HTMLInputElement).value)

			// if default is an attribute value
			if (!el.hasAttribute(splitted[1])) throw Error(`Error: "${this.input.getName()}" element don't have the attribute "${splitted[1]}"`)
			return this.input.setValue(el.getAttribute(splitted[1]))
		}
		this.input.setValue(attrVal)
	}

	public static listeners: AttributeListeners[] = [
		AttributeListeners.POST_CLEAR,
		AttributeListeners.FORM_INIT,
		AttributeListeners.FORM_FILL
	]

	public static identity: AttributeIdentity = {
		attribute: DefaultAttribute,
		dataElement: "data-default"
	}
}
