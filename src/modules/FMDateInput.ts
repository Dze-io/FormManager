import { FMAssignInterface } from '../Interfaces';
import FMInput from "../FMInput"

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class FMDateInput extends FMInput {

	setValue(value: Date|string) {
		// if value is a string set value to the date of the string
		if (typeof(value) == "string") {
			value = new Date(value)
		}
		this.element.valueAsDate = value
	}

	getValue(): Date|undefined {
		// if get date and if null return undefined else return value
		let date = this.element.valueAsDate
		return date == null ? undefined : date
	}

	getDefault(args: string): Date {
		// if data-default is present return the current date
		return new Date
	}
}

export const FMDateAssignement: FMAssignInterface = {
	input: FMDateInput,
	type: "date",
	tagName: "input"
}
