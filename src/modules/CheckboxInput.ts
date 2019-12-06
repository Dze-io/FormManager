import InputIdentity from './Interfaces/InputIdentity';
import DefaultInput from './DefaultInput';
import { toBoolean } from '../Functions';

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class CheckboxInput extends DefaultInput {

	public setValue(value: any) {
		this.element.checked = this.formatValue(value)
	}

	public getValue(): boolean {
		return this.element.checked
	}

	public formatValue(value: any): boolean {
		value = toBoolean(value)
		if (typeof value === "undefined") {
			return false
		}
		return value
	}

	public static identity: InputIdentity = {
		input: CheckboxInput,
		type: "checkbox"
	}
}
