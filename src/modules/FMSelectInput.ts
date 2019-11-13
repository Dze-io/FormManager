import { InputAssignment } from '../Interfaces';
import FMInput from "../FMInput"
import { realType } from '../Functions';

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class FMSelectInput extends FMInput {

	public formatValue(val: any): any {
		const opt = this.element.querySelector(`option[value="${val}"]`) || this.element.querySelector("option[selected]")
		if (opt) {
			return realType(opt.getAttribute("value") || "")
		}
		return undefined
	}
}

export const FMSelectAssignement: InputAssignment = {
	input: FMSelectInput,
	tagName: "select"
}
