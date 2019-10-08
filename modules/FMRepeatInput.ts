import { FMAssignInterface } from './../Interfaces';
import FormManager from "../FormManager"
import FMInput from "../FMInput"

/**
 *
 * @class FMRepeatInput
 * @extends {FMInput}
 */
export default class FMRepeatInput extends FMInput {

	elements: FMInput[][] = []

	private template: HTMLElement

	private addBtn: HTMLElement

	constructor(element: HTMLDivElement, form: FormManager) {
		super(element, form)

		//fetch Template
		this.template = element.querySelector(".fmr-template")
		this.template.style.display = "none"

		//fetch add button
		this.addBtn = element.querySelector(".fmr-add")
		this.addBtn.addEventListener("click", () => {
			if (!this.addBtn.hasAttribute("disabled")) this.addLine()
		})

		//Observer to handle attributes changes
		const observer = new MutationObserver((mutationList: any, observer: any) => {
			for (let mutation of mutationList) {
				if (mutation.type === 'attributes' && mutation.attributeName === "disabled") {
					this.element.querySelectorAll(".fmr-add, .fmr-del").forEach((el: HTMLElement) => {
						if (this.element.hasAttribute("disabled")) el.style.display = "none"
						else el.style.display = ""
					})
					if (this.element.hasAttribute("disabled")) this.addBtn.setAttribute("disabled", "")
					else this.addBtn.removeAttribute("disabled")
					for (const iterator of this.elements) {
						for (const i2 of iterator) {
							if (this.element.hasAttribute("disabled")) {
								i2.element.setAttribute("disabled", "")
								continue
							}
							i2.element.removeAttribute("disabled")
						}
					}
				}
			}
		})
		observer.observe(this.element, {attributes: true})
	}

	addLine(values?: any[]|any) {
		// the new line
		let node = this.element.insertBefore(this.template.cloneNode(true), this.addBtn) as HTMLElement
		node.classList.remove("fmr-template")
		node.classList.add("fmr-element")
		node.style.display = ""

		// loop through inputs ot init them
		let sub: FMInput[] = []
		node.querySelectorAll("[data-input]").forEach((el: HTMLElement) => {
			let input = this.form.getInit(el)
			if (this.element.hasAttribute("disabled")) {
				input.element.disabled = true
			}
			sub.push(input)
			// if values is a named array
			if (values != undefined && values[input.getName()] != undefined) {
				input.setValue(values[input.getName()])
			}
			// if value is a single string/number/etc
			if (typeof(values) != "object" && values != undefined) {
				input.setValue(values)
			}
		})
		this.elements.push(sub)

		// get the delete button
		let del = node.querySelector(".fmr-del")
		del.addEventListener("click", () => {
			if (!del.hasAttribute("disabled")) {
				let id = this.element.querySelectorAll(".fmr-element").length-1
				this.elements.splice(id)
				node.remove()
			}
		})
	}

	setValue(value: any[][]|string) {
		//remove every elements
		this.element.querySelectorAll(".fmr-element").forEach(el => {
			el.remove()
			this.elements = []
		})
		//ef string finish function
		if (typeof(value) == "string") return

		//create each line
		for (const indexStr in value) {
			let index = parseInt(indexStr)
			if (value.hasOwnProperty(index)) {
				const el = value[index];

				if (this.element.querySelectorAll(".fmr-element").length <= index) {
					//add element
					if ((el as any) == "") continue
					this.addLine(el)
					continue
				}
				// update element
			}
		}
	}

	getValue(): any[any] {
		let values = []
		for (const line of this.elements) {
			let lineArray: any = {}
			//one element repeat
			if (line.length == 1) {
				for (const col of line) {
					values.push(col.getValue())
				}
				continue
			}
			// multi elements repeat
			for (const col of line) {
				// if ()
				lineArray[col.getName()] = col.getValue()
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
