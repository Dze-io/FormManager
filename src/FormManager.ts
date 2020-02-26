import AttributesManager from './AttributesManager';
import InputIdentity from './modules/Interfaces/InputIdentity';
import DefaultInput from './modules/DefaultInput';
import AbstractInput from './modules/AbstractInput';
import InputArray from "./modules/Interfaces/InputArray";
import AttributeListeners from './attributes/AttributeListeners';

/*!
 * FormManager by DZEIO's team
 * MIT Licensed
 * https://dze.io
 */

/**
 * Manager for Forms
 *
 * @export
 * @class FormManager
 */
export default class FormManager {

	/**
	 * List of inputs
	 *
	 * @private
	 * @type {InputArray}
	 * @memberof FormManager
	 */
	public inputs: InputArray = {}

	/**
	 * List of interfaces
	 *
	 * @private
	 * @type {InputIdentity[]}
	 * @memberof FormManager
	 */
	private FMInputs: InputIdentity[] = []

	/**
	 * The Form Element of the FM
	 *
	 * @type {HTMLFormElement}
	 * @memberof FormManager
	 */
	public form: HTMLFormElement

	/**
	 * The Attribute Manager
	 *
	 * @type {AttributesManager}
	 * @memberof FormManager
	 */
	public attributeManager: AttributesManager

	/**
	 * The current mode of the form
	 *
	 * @memberof FormManager
	 */
	public mode = FMMode.EditMode

	/**
	 * Creates an instance of FormManager.
	 * @param {HTMLFormElement} form the form HTMLElement
	 * @memberof FormManager
	 */
	public constructor(form: HTMLFormElement, onSubmit?: (ev: Event) => void) {
		this.form = form
		this.attributeManager = new AttributesManager(this)

		//Prevent default submit action
		form.addEventListener("submit", (e: Event) => {
			e.preventDefault()
			onSubmit && onSubmit(e)
		})

		//assign default form interface
		this.assign(DefaultInput)

		//Setup the system for basic inputs
		this.setupInputs()
	}

	/**
	 * Add to the Manager an Input
	 *
	 * @param {...(typeof AbstractInput[])} inter the interface used
	 * @memberof FormManager
	 */

	public assign(...inter: (typeof AbstractInput[])) {
		for (const input of inter) {
			this.FMInputs.unshift(input.identity)
		}
	}

	/**
	 * Setup the differents inputs to be used with their interfaces
	 *
	 * @memberof FormManager
	 */
	public setupInputs() {
		this.inputs = {};
		const formID = this.form.getAttribute("id")

		// Find every inputs
		const request: NodeListOf<HTMLElement> = formID !== null ? document.querySelectorAll(`[form="${formID}"][name]:not([data-name]), form#${formID} [name]:not([data-name])`) : this.form.querySelectorAll("[name]:not([data-name])")

		// Find each input their class
		request.forEach((element: HTMLElement) => {
			let el = this.getInit(element)
			if (el) this.inputs[el.getName()] = el
		});
		this.attributeManager.trigger(AttributeListeners.FORM_INIT)
	}

	/**
	 * Retrieve a specific FMInput for a Specific Input
	 *
	 * @param {HTMLElement} element
	 * @returns {FMInput}
	 * @memberof FormManager
	 */
	public getInit(element: HTMLElement): AbstractInput|void {
		inputsLoop: for (const input of this.FMInputs) {
			if (input.classes != undefined) {
				let tmpList: string[] = []
				if (typeof input.classes === "object") tmpList = input.classes
				if (typeof input.classes === "string") tmpList = [input.classes]
				for (const classe of tmpList) {
					if(!element.classList.contains(classe)) continue inputsLoop
				}
			}
			if (input.attributes != undefined) {
				let tmpList: string[] = []
				if (typeof input.attributes === "object") tmpList = input.attributes
				if (typeof input.attributes === "string") tmpList = [input.attributes]
				for (const classe of tmpList) {
					if(!element.hasAttribute(classe)) continue inputsLoop
				}
			}
			if (input.type !== undefined) {
				if(element.getAttribute("type") !== input.type) continue
			}
			if (input.tagName !== undefined) {
				if (element.nodeName.toLowerCase() !== input.tagName.toLowerCase()) continue
			}
			return new (input.input)(element, this)
		}
	}

	/**
	 * Verify the inputs for errors
	 *
	 * @param {boolean} [quick=false] define if the loop should stop after the first error
	 * @returns {AbstractInput[]} return an array containing the errored elements (Empty if not error)
	 * @memberof FormManager
	 */
	public validate(quick = false): AbstractInput[] {
		const errored: AbstractInput[] = []
		for (const name in this.inputs) {
			if (!this.inputs.hasOwnProperty(name)) continue
			const input = this.inputs[name];
			const res = this.attributeManager.triggerElement(AttributeListeners.VERIFY, input) as boolean
			if (input.verify() && res) continue
			this.attributeManager.triggerElement(AttributeListeners.INPUT_ERROR, input)
			errored.push(input)
			if(quick) {
				return errored
			}
		}
		return errored
	}

	/**
	 * Same as `validate` but return a boolean
	 *
	 * @returns {boolean}
	 * @memberof FormManager
	 */
	public verify(quick = true): boolean {
		return this.validate(quick).length === 0
	}

	/**
	 * Submit the form to the `url` in a JSON format
	 * You can plug an XMLHttpRequest loadend event in the `callback` to recover the results
	 *
	 * @param {string} url the url
	 * @param {(this: XMLHttpRequest, ev: ProgressEvent) => any} [callback] callback of event `loadend`
	 * @param {boolean} [verify=true] is the content verified beforehand (won't be sent if not correct)
	 * @returns {boolean} return if the content was sent or not
	 * @memberof FormManager
	 */
	public send(url: string, callback?: (this: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>) => void, options: {verify?:boolean, method?: string} = {verify: true, method: "POST"}): boolean {
		// Fetch datas
		let datas = this.getJSON()

		// Verify datas
		if ((options.verify === undefined || (typeof options.verify === "boolean" && options.verify)) && !this.verify()) return false

		// Trigger Event
		const ev = this.attributeManager.trigger(AttributeListeners.FORM_SUBMIT, datas)
		if (ev && typeof ev !== "boolean") datas = ev

		// Send Request
		const ajax = new XMLHttpRequest
		ajax.open(options.method || "POST", url)
		ajax.setRequestHeader("Content-Type", "application/json")
		ajax.addEventListener("loadend", callback || (() => {}))
		ajax.send(JSON.stringify(datas))
		return true
	}

	/**
	 * Manually set the value of an element
	 *
	 * @param {string} name
	 * @param {*} value
	 * @memberof FormManager
	 */
	public setValue(name: string, value: any) {
		if (!this.inputs.hasOwnProperty(name)) {
			return
		}
		const input = this.inputs[name]
		input.setValue(value)
	}
	/**
	 * Return the JSON `{key: value}` sequence
	 *
	 * @memberof FormManager
	 */
	public getJSON(): {[key: string]: any} {
		const jsonObject: any = {}
		for (const name in this.inputs) {
			if (this.inputs.hasOwnProperty(name)) {
				const input = this.inputs[name];
				const val = input.getValue()
				if (val != undefined) jsonObject[name] = val
			}
		}
		return jsonObject
	}

	/**
	 * Fill the form from JSON
	 *
	 * Hint: _to see what the json look like, use `fm.getJSON`_
	 *
	 * @param {*} json the JSON
	 * @memberof FormManager
	 */
	public fillFromJSON(json: any) {
		for (const key in json) {
			if (!json.hasOwnProperty(key)) {
				continue
			}
			const element = json[key];
			if (this.inputs[key] === undefined) {
				console.warn(`${key} is not a valid input name`)
				continue
			}
			this.inputs[key].setValue(element)
		}
		this.attributeManager.trigger(AttributeListeners.FORM_FILL)
	}

	/**
	 * fill form from an `uri`
	 *
	 * the format MUST be `JSON`
	 *
	 * @param {string} uri the URI
	 * @memberof FormManager
	 */
	public fillFromURI(uri: string, callback?: () => void) {
		let ajax = new XMLHttpRequest
		ajax.open("GET", uri, true)
		ajax.addEventListener("loadend", () => {
			if (ajax.readyState === 4 && ajax.status === 200) {
				let json = JSON.parse(ajax.responseText)
				this.fillFromJSON(json)
				if (callback !== undefined) callback()
			}
		})
		ajax.send()
	}

	/**
	 * Set the mode of the Form
	 *
	 * @param {FMMode} mode
	 * @memberof FormManager
	 */
	public setMode(mode: FMMode) {
		this.mode = mode
		if (mode == FMMode.ViewMode) {
			for (const name in this.inputs) {
				if (this.inputs.hasOwnProperty(name)) {
					const input = this.inputs[name];
					input.element.setAttribute("disabled", "")
				}
			}
		}
		if (mode == FMMode.EditMode) {
			for (const name in this.inputs) {
				if (this.inputs.hasOwnProperty(name)) {
					const input = this.inputs[name];
					input.element.removeAttribute("disabled")
				}

			}
		}
		this.attributeManager.trigger(AttributeListeners.MODE_SWITCH, mode)
	}

	/**
	 * Same as `setMode` but only for one input
	 *
	 * _don't trigger `MODE_SWITCH` event_
	 *
	 * @param {FMMode} mode
	 * @param {string} inputName
	 * @memberof FormManager
	 */
	public setModeForInput(mode: FMMode, inputName: string) {
		if (mode == FMMode.ViewMode) {
			if (this.inputs[inputName]) {
				this.inputs[inputName].element.setAttribute("disabled", "")
			}
			return
		}
		if (mode == FMMode.EditMode) {
			if (this.inputs[inputName]) {
				this.inputs[inputName].element.removeAttribute("disabled")
			}
		}
	}

	/**
	 * Clear the fields in the form
	 *
	 * @memberof FormManager
	 */
	public clear() {
		if (this.attributeManager.trigger(AttributeListeners.PRE_CLEAR) === false) return
		for (const name in this.inputs) {
			if (this.inputs.hasOwnProperty(name)) {
				const input = this.inputs[name];
				input.setValue(undefined)
			}
		}
		this.attributeManager.trigger(AttributeListeners.POST_CLEAR)
	}

	public clearInput(input: string) {
		if (this.inputs.hasOwnProperty(input)) {
			const inp = this.inputs[input];
			inp.setValue(undefined)
		}
	}
}

export enum FMMode {
	EditMode,
	ViewMode
}
