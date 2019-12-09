import AbstractAttribute from "./AbstractAttribute";
import AttributeListeners from "./AttributeListeners";
import AttributeIdentity from "./Interfaces/AttributeIdentity";
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
export default class ErrorAttribute
extends AbstractAttribute {
	public trigger(attrs: AttributeListeners): void {
		if (attrs === AttributeListeners.INPUT_UNFOCUS) {
			if (!this.input.verify()) {
				this.activate()
				return
			}
			const errorClasses = this.input.element.dataset.errorClass
			if (errorClasses) {
				this.input.element.classList.remove(...errorClasses.split(" "))
			}

			return
		}
		this.activate()
	}

	private activate() {
		const errorClasses = this.input.element.dataset.errorClass
		const errorRun = this.input.element.dataset.errorRun
		if (errorClasses) {
			this.input.element.classList.add(...errorClasses.split(" "))
		}
		if (errorRun) {
			evalF(errorRun)
		}
	}

	public static listeners: AttributeListeners[] = [
		AttributeListeners.INPUT_ERROR,
		AttributeListeners.INPUT_UNFOCUS
	]

	public static identity: AttributeIdentity = {
		attribute: ErrorAttribute,
		dataElement: "data-error"

	}
}
