import InputIdentity from './Interfaces/InputIdentity';
import DefaultInput from './DefaultInput';
import { realType } from '../Functions';

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class SelectInput extends DefaultInput {

	public formatValue(value: any): any {
		if (typeof value === "undefined") {
			const opt: HTMLOptionElement|null = this.element.querySelector("option[selected]")
			if (opt) {
				return opt.value
			}
		}
		return realType(value)
	}

	public static identity: InputIdentity = {
		input: SelectInput,
		tagName: "select"
	}
}
