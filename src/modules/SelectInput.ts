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
		this.element.value = this.formatValue(value)
	}

	public formatValue(value: any): any {
		if (typeof value !== "undefined" && value !== "") {
			return realType(value)
		}
		const opt = this.element.querySelector("option[selected]") || undefined
		if (opt) {
			return (opt as HTMLOptionElement).value
		}
		throw Error(":O it should never come here")
	}

	public static identity: InputIdentity = {
		input: SelectInput,
		tagName: "select"
	}
}
