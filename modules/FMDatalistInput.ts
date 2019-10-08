import { FMAssignInterface } from '../Interfaces';
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
		if (value == "") {
			this.element.value = ""
			return
		}
		if (this.datalist) {
			if ((value as any).id != undefined) {
				value = (value as any).id
			}
			let option: HTMLOptionElement = this.datalist.querySelector(`[data-value="${value}"]`)
			if (option != undefined) {
				this.element.value = option.value
				return
			}
			if (option == undefined && !this.isStrict) {
				this.element.value = value
				return
			}
			if (option || !this.isStrict) {
				this.element.value = value
				return
			}
		}
	}

	getValue(): string {
		if (this.datalist) {
			let option: HTMLOptionElement = this.datalist.querySelector(`[value="${this.element.value}"]`)
			if (option) return this.formatValue(option.dataset.value)
		}
		return this.isStrict ? undefined : this.formatValue(this.element.value)
	}
}

export const FMDatalistAssignement: FMAssignInterface = {
	input: FMDatalistInput,
	attributes: "list",
	tagName: "input"
}
