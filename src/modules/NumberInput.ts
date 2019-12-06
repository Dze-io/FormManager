import InputIdentity from './Interfaces/InputIdentity';
import DefaultInput from './DefaultInput';
import { toNumber, isNumber } from '../Functions';

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class NumberInput extends DefaultInput {

	public formatValue(value: any): number|undefined {
		const n = toNumber(value)
		return n
	}

	public verify(): boolean {
		return typeof this.getValue() === "undefined" || isNumber(this.getValue())
	}

	public static identity: InputIdentity = {
		input: NumberInput,
		type: "number"
	}
}
