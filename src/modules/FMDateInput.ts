import { InputAssignment } from '../Interfaces';
import FMInput from "../FMInput"

/**
 *
 * @class FMDateInput
 * @extends {FMInput}
 */
export default class FMDateInput extends FMInput {

	setValue(value: any) {
		// handle GO null value
		const format = this.formatValue(value)
		if (format) {
			this.element.valueAsDate = format
		}
		this.element.value = format
	}

	getValue(): Date|undefined {
		// if get date and if null return undefined else return value
		let date = this.element.valueAsDate
		return date == null ? undefined : date
	}

	public formatValue(val: any): Date|undefined {
		if (val === "0001-01-01T00:00:00Z") {
			return undefined
		}
		if (typeof val === "string" || typeof val === "number") {
			return new Date(val)
		}
		if (typeof val === "object" && typeof val.getDate === "function") {
			return (val as Date)
		}
		return undefined
	}
}

export const FMDateAssignement: InputAssignment = {
	input: FMDateInput,
	type: "date",
	tagName: "input"
}
