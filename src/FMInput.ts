import FormManager from "./FormManager"
import { realType } from "./Functions"

export default class FMInput {

	element: HTMLInputElement
	form: FormManager
	required: boolean

	constructor(element: Element, form: FormManager) {
		this.element = element as HTMLInputElement
		this.form = form
		this.required = element.hasAttribute("required")
	}

	/**
	 * Set the element Value
	 *
	 * @param {*} value the input value
	 *
	 * _hint: pass it through this.formatValue_
	 *
	 * @memberof FMInput
	 */
	public setValue(value: any) {
		this.element.value = value
	}

	/**
	 * Get the element value
	 *
	 * @returns {*} the value
	 * @memberof FMInput
	 */
	public getValue(): any {
		return this.formatValue(this.element.value)
	}


	/**
	 * Format the value into a usable one by the module
	 *
	 * for elements like `select` if the value don't correspond to something
	 * it will return the default `value`
	 *
	 * @param {*} value
	 * @returns {*}
	 * @memberof FMInput
	 */
	public formatValue(value: any): any {
		// if the value is a number return it as a number obj
		return realType(value)
	}

	/**
	 * Retrieve the input name
	 *
	 * @returns {string}
	 * @memberof FMInput
	 */
	public getName(): string {
		// while we search for inputs containing [name] we search for the input real name in [name] or [data-name]
		// (Allow other inputs to play with inputs)
		let attr = this.element.getAttribute("name") || this.element.dataset.name;
		if (attr) return attr
		throw Error("Error: could not get input name!")
	}

	/**
	 * Verify if the element is correct
	 *
	 * @returns {boolean}
	 * @memberof FMInput
	 */
	public verify(): boolean {
		let val: any = this.getValue()
		// if element is required and value is undefined retur false
		if (this.required && (val === undefined || val === null || val === "")) return false

		return true
	}
}
