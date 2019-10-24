import { FMAssignInterface } from '../Interfaces';
import FMInput from "../FMInput"

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class FMSelectInput extends FMInput {

	getDefault(): any {
		// check if element as a selected element and if true return it's value
		let def = this.element.querySelector("option[selected]")
		if (def) {
			return (def as HTMLOptionElement).value
		}
	}
}

export const FMSelectAssignement: FMAssignInterface = {
	input: FMSelectInput,
	tagName: "select"
}
