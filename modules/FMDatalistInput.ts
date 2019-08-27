import { FMAssignInterface } from './../Interfaces';
import FormManager from "../FormManager"
import FMInput from "../FMInput"

/**
 * the upgraded datalist element
 * @priority 2
 * @class FMDatalistInput
 * @extends {FMInput}
 */
export default class FMDatalistInput extends FMInput {

	datalist: HTMLDataListElement
	isStrict: boolean

	constructor(element: HTMLInputElement, form: FormManager) {
		super(element, form)
		this.isStrict = this.element.hasAttribute("data-strict")
		let id = this.element.getAttribute("list")
		let tmpDatalist = document.getElementById(id)
		this.datalist = tmpDatalist !== undefined ? tmpDatalist as HTMLDataListElement : undefined
	}

	setValue(value: string) {
		if (this.datalist) {
			let option: HTMLOptionElement = this.datalist.querySelector(`[value="${value}"]`)
			if (option || !this.isStrict) {
				this.element.value = value
			}
		}
	}

	getValue(): string {
		if (this.datalist) {
			let option: HTMLOptionElement = this.datalist.querySelector(`[value="${this.element.value}"]`)
			if (option) return option.dataset.value
		}
		return this.isStrict ? undefined : this.element.value
	}
}

export const FMDatalistAssignement: FMAssignInterface = {
	input: FMDatalistInput,
	attributes: "list",
	tagName: "input"
}
