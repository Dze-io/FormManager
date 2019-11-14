import FormManager from "../FormManager"
import InputIdentity from './Interfaces/InputIdentity';
import DefaultInput from './DefaultInput';

/**
 * the upgraded datalist element
 * @class FMDatalistInput
 * @extends {FMInput}
 */
export default class DatalistInput extends DefaultInput {

	datalist: HTMLDataListElement
	isStrict: boolean

	constructor(element: HTMLElement, form: FormManager) {
		super(element, form)

		// check if input is strict on inputs
		this.isStrict = this.element.hasAttribute("data-strict")

		// get datalist id
		let id = this.element.getAttribute("list")
		if (!id) throw Error(`Error: your input "${this.getName()}" MUST have a list attribute`);

		// get datalist
		this.datalist = document.getElementById(id) as HTMLDataListElement
		if (!this.datalist) throw Error(`Error: Datalist not found for ${this.getName()} input`)
	}

	setValue(value: string) {
		// if value is "" set value to ""
		if (value == "" || value === undefined) {
			this.element.value = ""
			return
		}
		// value is an object containing an id then set value to the id
		if ((value as any).id != undefined) {
			value = (value as any).id
		}

		// get the option element containing the value
		let option = this.datalist.querySelector(`[data-value="${value}"]`)

		// if it was set set the element value to the option value
		if (option != undefined) {
			this.element.value = (option as HTMLOptionElement).value
			return
		}

		// if datalist is not strict set it to the value inputted
		if (!this.isStrict) {
			this.element.value = value
			return
		}
	}

	getValue(): string {
		// if element value == option value return option data-value
		let option = this.datalist.querySelector(`[value="${this.element.value}"]`)
		if (option) return this.formatValue((option as HTMLOptionElement).dataset.value)

		// if strict return undefined else return element value
		return this.isStrict ? undefined : this.formatValue(this.element.value)
	}

	public static identity: InputIdentity = {
		input: DatalistInput,
		attributes: "list",
		tagName: "input"
	}

}
