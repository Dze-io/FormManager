import { FMAssignInterface } from './../Interfaces';
import FMInput from "../FMInput"

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class FMDateInput extends FMInput {

	setValue(value: Date) {
		this.element.valueAsDate = value
	}

	getValue(): Date {
		return this.element.valueAsDate
	}

	getDefault(args: string): Date {
		return new Date
	}
}

export const FMDateInputAssignement: FMAssignInterface = {
	input: FMDateInput,
	type: "date",
	tagName: "input"
}
