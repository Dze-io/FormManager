import FormManager from "./FormManager"

export default class FMInput {

	element: HTMLInputElement
	form: FormManager

	constructor(element: HTMLElement, form: FormManager) {
		this.element = element as HTMLInputElement
		this.form = form
		if (this.element.hasAttribute("data-default")) {
			this.setValue(this.getDefault(this.element.dataset.default))
		}
	}

	setValue(value: any) {
		this.element.value = value
		this.element.setAttribute("value", value)
	}
	getValue(): any {
		return this.element.value
	}

	getDefault(args: string): any {
		return args
	}

	getName(): string {
		return this.element.getAttribute("name")
	}

	verify(): boolean {
		let val: string = this.getValue()
		if(val == "" && this.element.hasAttribute("required")) {
			return false
		}
		if(this.element.dataset.regex !== undefined) {
			return new RegExp(this.element.dataset.regex, 'g').test(val as string)
		}
		return true
	}
}
