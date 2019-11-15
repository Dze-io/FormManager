import InputIdentity from './Interfaces/InputIdentity'
import DefaultInput from './DefaultInput'

/**
 *
 * @class FMDateInput
 * @extends {DefaultInput}
 */
export default class DateInput extends DefaultInput {

	public setValue(value: any) {
		// handle GO null value
		const format = this.formatValue(value)
		if (typeof format === "object") {
			this.element.valueAsDate = format
			return
		}
		this.element.value = ""
	}

	public getValue(): Date|undefined {
		// if get date and if null return undefined else return value
		let date = this.element.valueAsDate
		return date == null ? undefined : date
	}

	public formatValue(val: any): Date|undefined {
		if (typeof val === "object" && typeof val.getDate === "function") {
			return (val as Date)
		}
		if (val === "0001-01-01T00:00:00Z") {
			return undefined
		}
		if (typeof val === "string" || typeof val === "number") {
			return new Date(val)
		}
		return undefined
	}

	public static identity: InputIdentity = {
		input: DateInput,
		type: "date",
		tagName: "input"
	}
}
