import FormManager from "../FormManager"
import DefaultInput from './DefaultInput';
import InputAbstract from './InputAbstract';
import InputIdentity from './Interfaces/InputIdentity';

/**
 *
 * @class FMRepeatInput
 * @extends {FMInput}
 */
export default class RepeatInput extends DefaultInput {

	elements: InputAbstract[][] = []

	private template: DocumentFragment

	private addBtn: HTMLElement

	constructor(element: HTMLElement, form: FormManager) {
		super(element, form)

		//fetch Template
		let tmplEl = element.querySelector("template")
		if (tmplEl) {
			this.template = tmplEl.content
			tmplEl.remove()
		} else {
			let el = element.querySelector(".fmr-template")
			if (!el) {
				throw Error("No Template or .fmr-template elements were found!")
			}
			el.classList.remove("fmr-template")
			this.template = new DocumentFragment
			this.template.appendChild(el.cloneNode(true))
			el.remove()
		}

		if (!this.template) throw Error(`Your repeat input "${this.getName()}" MUST have a child with the class .fmr-template`);

		//fetch add button
		this.addBtn = element.querySelector(".fmr-add") as HTMLElement
		if (!this.addBtn) throw Error(`Your repeat element "${this.getName()}" MUST have a child with the class .fmr-add`);

		this.addBtn.addEventListener("click", () => {
			if (!this.addBtn.hasAttribute("disabled")) this.addLine()
		})

		// Observer to handle attributes changes
		const observer = new MutationObserver((mutationList: any) => {
			for (let mutation of mutationList) {
				if (mutation.type === 'attributes' && mutation.attributeName === "disabled") {
					(this.element.querySelectorAll(".fmr-add, .fmr-del") as NodeListOf<HTMLElement>).forEach((el: HTMLElement) => {
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
		const clone = document.importNode(this.template, true)
		this.element.insertBefore(clone, this.addBtn)
		let node = this.element.children.item(this.element.childElementCount-2) as HTMLElement
		console.log(node)
		node.classList.add("fmr-element")
		node.style.display = ""

		// loop through inputs ot init them
		let sub: InputAbstract[] = [];
		(node.querySelectorAll("[data-input]") as NodeListOf<HTMLElement>).forEach((el: HTMLElement) => {
			let input = this.form.getInit(el)
			console.log(input, values)
			if (!input) {
				return
			}
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
		if (del) del.addEventListener("click", () => {
			if (del && !del.hasAttribute("disabled")) {
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

	public verify(): boolean {
		for (const el of this.elements) {
			for (const i of el) {
				if (!i.verify()) return false
			}
		}
		return true
	}

	public static identity: InputIdentity = {
		input: RepeatInput,
		classes: "fm-repeat",
		tagName: "div"
	}
}
