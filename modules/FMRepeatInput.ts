import { FMAssignInterface } from './../Interfaces';
import FormManager from "../FormManager"
import FMInput from "../FMInput"

/**
 *
 * @class FMRepeatInput
 * @extends {FMInput}
 */
export default class FMRepeatInput extends FMInput {

	constructor(element: HTMLDivElement, form: FormManager) {
		super(element, form)

		//fetch Template
		let template: HTMLElement = element.querySelector(".fmr-template")
		template.style.display = "none"

		//fetch add button
		let addBtn = element.querySelector(".fmr-add")
		addBtn.addEventListener("click", () => {
			let node = element.insertBefore(template.cloneNode(true), addBtn) as HTMLElement
			node.classList.remove("fmr-template")
			node.classList.add("fmr-element")
			node.style.display = ""
			let del = node.querySelector(".fmr-del")
			del.addEventListener("click", () => {
				node.remove()
			})
		})

	}

	loopInputs(): FMInput[][] {
		let inputs: FMInput[][] = []
		this.element.querySelectorAll(".fmr-element").forEach((pouet: HTMLElement) => {
			let subElement: FMInput[] = []
			pouet.querySelectorAll("[data-input]").forEach((localElement: HTMLElement) => {
				subElement.push(this.form.getInit(localElement))
			});
			inputs.push(subElement)
		})
		return inputs
	}

	setValue(value: any[][]) {
		for (const index in value) {
			if (value.hasOwnProperty(index)) {
				const element = value[index];
				console.log(index,element, value)
			}
		}
	}

	getValue(): any[][] {
		let values: any[][] = []
		let elements = this.loopInputs()
		for (const line of elements) {
			let lineArray: any[] = []
			for (const col of line) {
				lineArray.push(col.getValue())
			}
			values.push(lineArray)
		}
		return values
	}
}

export const FMRepeatInputAssignment: FMAssignInterface = {
	input: FMRepeatInput,
	classes: "fm-repeat",
	tagName: "div"
}
