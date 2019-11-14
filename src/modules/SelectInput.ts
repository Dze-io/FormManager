import InputIdentity from './Interfaces/InputIdentity';
import DefaultInput from './DefaultInput';
import { realType } from '../Functions';

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class SelectInput extends DefaultInput {

	public formatValue(val: any): any {
		const opt = this.element.querySelector(`option[value="${val}"]`) || this.element.querySelector("option[selected]")
		if (opt) {
			return realType(opt.getAttribute("value") || "")
		}
		return undefined
	}

	public static identity: InputIdentity = {
		input: SelectInput,
		tagName: "select"
	}
}
