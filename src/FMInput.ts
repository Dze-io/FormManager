import FormManager from "./FormManager"

export default class FMInput {

	element: HTMLInputElement
	form: FormManager
	required: boolean

	constructor(element: Element, form: FormManager) {
		this.element = element as HTMLInputElement
		this.form = form
		this.required = element.hasAttribute("required")

		// Set element value to it's default one
		this.setToDefault()
	}

	/**
	 * Set the element Value
	 *
	 * @param {*} value
	 * @memberof FMInput
	 */
	setValue(value: any) {
		this.element.value = value
	}

	/**
	 * Get the element value
	 *
	 * @returns {*} the value
	 * @memberof FMInput
	 */
	getValue(): any {
		return this.formatValue(this.element.value)
	}


	/**
	 * Format the value
	 * ex: if the value is "1" it will return the value as a number 1
	 *
	 * @protected
	 * @param {*} value
	 * @returns {*}
	 * @memberof FMInput
	 */
	protected formatValue(value: any): any {
		// if the value is a number return it as a number obj
		if (!isNaN(Number(value))) return Number(value)
		return value

	}

	getDefault(args?: string): any {
		// if arg is set and startsWith run: run the function in it
		if (args && args.startsWith("run:")) {
			args = args.split("run:")[1]
			return eval(args)
		}
		return args
	}

	setToDefault() {
		if (this.element.hasAttribute("data-default")) {
			return this.setValue(this.getDefault(this.element.dataset.default))
		}
		return this.setValue(this.getDefault(""))
	}

	/**
	 * Retrieve the input name
	 *
	 * @returns {string}
	 * @memberof FMInput
	 */
	getName(): string {
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
	verify(): boolean {
		let val: any = this.getValue()
		// if element is required and value is undefined retur false
		if (this.required && (val === undefined || val === null || val === "")) return false

		// check regex
		const regex = this.element.dataset.regex
		if(regex) {
			return new RegExp(regex, 'g').test(val + "")
		}
		return true
	}
}
