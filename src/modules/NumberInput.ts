import InputIdentity from './Interfaces/InputIdentity';
import DefaultInput from './DefaultInput';
import { toNumber, isNumber } from '../Functions';
import FormManager from '../FormManager';

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class NumberInput extends DefaultInput {

	constructor(element: HTMLElement, form: FormManager) {
		super(element, form)
		const regex = new RegExp("^[0-9.]{1}|Backspace$")
		element.addEventListener("keydown", (ev: KeyboardEvent) => {
			if (!regex.test(ev.key) && !ev.ctrlKey) {
				ev.preventDefault()
			}
		})

		// Desactivate Wheel Event
		element.addEventListener("wheel", (e: WheelEvent) => {
			if (document.activeElement === this.element) e.preventDefault()
		})
	}

	public formatValue(value: any): number|undefined {
		const n = toNumber(value)
		return n
	}

	public verify(): boolean {
		const val = this.getValue()
		if ( val === undefined && this.element.hasAttribute("required")) return false
		return typeof val === "undefined" || isNumber(val)
	}

	public static identity: InputIdentity = {
		input: NumberInput,
		type: "number"
	}
}
