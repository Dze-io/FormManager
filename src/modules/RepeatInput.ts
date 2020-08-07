import FormManager from "../FormManager"
import DefaultInput from './DefaultInput';
import InputAbstract from './AbstractInput';
import InputIdentity from './Interfaces/InputIdentity';

/**
 *
 * @class FMRepeatInput
 * @extends {FMInput}
 */
export default class RepeatInput extends DefaultInput {

	public elements: InputAbstract[][] = []

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
		node.classList.add("fmr-element")
		node.style.display = ""
		if ('draggable' in this.element.dataset) {
			node.draggable = true
			node.addEventListener('dragstart', (ev) => {
				ev.dataTransfer?.setData('text', JSON.stringify({index: getNodePosition(this.element, node), name: this.getName()}))
			})
			node.addEventListener('drop', (ev) => {
				ev.preventDefault()

				if (!ev.dataTransfer?.getData('text')) {
					return
				}

				const transferData = JSON.parse(ev.dataTransfer.getData('text'))

				if (transferData.name !== this.getName()) {
					return
				}

				const otherItemPos = transferData.index
				const currentItemPos = getNodePosition(this.element, node)

				const val = this.getValue()
				const item = val[otherItemPos]

				// First Part slice
				const firstPart = val.slice(undefined, currentItemPos)
				const secondPart = val.slice(currentItemPos)

				// Second part remove item
				const frstpIndex = firstPart.indexOf(item)
				const scndPIndex = secondPart.indexOf(item)
				if (frstpIndex !== -1) {
					firstPart.splice(frstpIndex, 1)
				} else if (scndPIndex !== -1) {
					secondPart.splice(scndPIndex, 1)
				}

				//third part merge all
				this.form.setValue(this.getName(), firstPart.concat(item, ...secondPart))
			})
			node.addEventListener('dragover', (ev) => ev.preventDefault())
		}

		// loop through inputs ot init them
		let sub: InputAbstract[] = [];
		(node.querySelectorAll("[data-input]") as NodeListOf<HTMLElement>).forEach((el: HTMLElement) => {
			let input = this.form.getInit(el)
			if (!input) {
				return
			}
			if (this.element.hasAttribute("disabled")) {
				input.element.disabled = true
			}
			sub.push(input)

			const name = input.getName()

			// if values is a named array
			if (values !== undefined && typeof values === 'object' && name in values) {
				input.setValue(values[name])
				return
			}

			// Set default value
			input.setValue(values)
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
		})
		this.elements = []
		//ef string finish function
		if (typeof(value) == "string") return

		//create each line
		for (const indexStr in value) {
			let index = parseInt(indexStr)
			if (!Object.prototype.hasOwnProperty.call(value, index)) {
				continue
			}
			const el = value[index];

			if (this.element.querySelectorAll(".fmr-element").length <= index) {
				this.addLine(el)
				continue
			}
		}
	}

	getValue(): any[any] {
		let values = []
		for (const line of this.elements) {
			let lineArray: any = {}
			const realLine: InputAbstract[] = []
			for (let i = 0; i < line.length; i++) {
				const col = line[i];
				if (!col.element.hasAttribute('data-ignore')) {
					realLine.push(col)
				}
			}
			//one element repeat
			if (realLine.length === 1) {
				for (const col of realLine) {
					values.push(col.getValue())
				}
				continue
			}
			// multi elements repeat
			for (const col of realLine) {
				// if ()
				lineArray[col.getName()] = col.getValue()
			}
			values.push(lineArray)
		}
		return values
	}

	public verify(): boolean {
		if (this.element.hasAttribute('required') && this.elements.length === 0) {
			return false
		}
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

function getNodePosition(parent: HTMLElement, node: HTMLElement) {
	for (const index in parent.children) {
		if (!Object.prototype.hasOwnProperty.call(parent.children, index)) {
			continue
		}
		const child = parent.children[index];
		if (child === node) {
			return parseInt(index)
		}
	}
	return 0
}
