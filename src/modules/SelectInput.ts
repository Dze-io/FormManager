import InputIdentity from './Interfaces/InputIdentity';
import DefaultInput from './DefaultInput';
import { realType } from '../Functions';

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class SelectInput extends DefaultInput {

	public setValue(value: any) {
		value = realType(value)
		let opt:HTMLOptionElement|undefined = this.element.querySelector(`option[value="${value}"]`) || undefined
		if (opt) {
			this.element.value = value
			return
		}
		opt = this.element.querySelector("option[selected]") || undefined
		if (opt) {
			this.element.value = opt.value
		}
	}

	public formatValue(value: any): any {
		if (typeof value !== "undefined" && value !== "") {
			return realType(value)
		}
		const opt: HTMLOptionElement|undefined = this.element.querySelector("option[selected]") || undefined
		if (opt) {
			return opt.value
		}
		throw Error(":O it should never come here")
	}

	public static identity: InputIdentity = {
		input: SelectInput,
		tagName: "select"
	}
}
