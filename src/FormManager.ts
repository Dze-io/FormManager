import AttributesManager from './AttributesManager';
import InputIdentity from './modules/Interfaces/InputIdentity';
import DefaultInput from './modules/DefaultInput';
import InputAbstract from './modules/InputAbstract';
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
	 * The last verified `FMInput` that returned an error
	 *
	 * @type {FMInput}
	 * @memberof FormManager
	 */
	public lastErroredInput: InputAbstract|undefined

	/**
	 * The Form Element of the FM
	 *
	 * @type {HTMLFormElement}
	 * @memberof FormManager
	 */
	public form: HTMLFormElement

	public attributeManager: AttributesManager


	/**
	 * Creates an instance of FormManager.
	 * @param {HTMLFormElement} form the form HTMLElement
	 * @memberof FormManager
	 */
	constructor(form: HTMLFormElement) {
		this.form = form
		this.attributeManager = new AttributesManager(this)

		//Prevent default submit action
		form.onsubmit = (e) => {
			e.preventDefault()
		}

		//assign default form interface
		this.assign(DefaultInput)

		//Setup the system for basic inputs
		this.setupInputs()
	}

	/**
	 * Add to the Manager an Input
	 *
	 * @param {InputIdentity[]} inter the interface used
	 * @memberof FormManager
	 */
	public assign(...inter: (typeof InputAbstract[])) {
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
		(this.form.querySelectorAll("[name]:not([data-name])") as NodeListOf<HTMLElement>).forEach((element: HTMLElement) => {
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
	public getInit(element: HTMLElement): InputAbstract|void {
		inputsLoop: for (const input of this.FMInputs) {
			if (input.classes != undefined) {
				let tmpList: string[] = []
				if (typeof input.classes == "object") tmpList = input.classes
				if (typeof input.classes === "string") tmpList = [input.classes]
				for (const classe of tmpList) {
					if(!element.classList.contains(classe)) continue inputsLoop
				}
			}
			if (input.attributes != undefined) {
				let tmpList: string[] = []
				if (typeof input.attributes == "object") tmpList = input.attributes
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
	 * If it return false you can use `fm.lastErroredInput` to get the `FMInput` that errored
	 *
	 * @returns {boolean} if the requirements are correct or not (it will stop checking at the first issue)
	 * @memberof FormManager
	 */
	public verify(): boolean {
		for (const name in this.inputs) {
			if (this.inputs.hasOwnProperty(name)) {
				const input = this.inputs[name];
				const res = this.attributeManager.triggerElement(AttributeListeners.VERIFY, input) as boolean
				if(!input.verify() || !res) {
					console.log(input.verify(), res)
					this.lastErroredInput = input
					return false
				}
			}
		}
		this.lastErroredInput = undefined
		return true
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
	public submit(url: string, callback?: (this: XMLHttpRequest, ev: ProgressEvent) => void, verify: boolean = true): boolean {
		if (verify && !this.verify()) return false
		let toSend = this.getJSON()
		let event = this.attributeManager.trigger(AttributeListeners.FORM_SUBMIT, toSend)
		if (typeof event !== "boolean" && event) {
			toSend = event
		}
		let ajax = new XMLHttpRequest
		ajax.open("POST", url, true)
		ajax.setRequestHeader("Content-Type", "application/json")
		if (callback != undefined) ajax.addEventListener("loadend", callback)
		ajax.send(JSON.stringify(toSend))
		return true
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
			if (json.hasOwnProperty(key)) {
				const element = json[key];
				if(this.inputs[key] !== undefined) this.inputs[key].setValue(element)
				else console.warn(`${key} is not a valid input name`)
			}
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
				if (callback != undefined) callback()
			}
		})
		ajax.send()
	}

	public mode = FMMode.EditMode;
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
}

export enum FMMode {
	EditMode,
	ViewMode
}

/**
 * TODO: FMFileInput
 * have a data-type with an typeId linked to an URI
 * on file set -> show button to upload
 * on file change -> show button "delete and upload"
 * on upload -> upload and create hidden field with the result ID
 * on delete -> show notif about it
 * if pic -> show preview
 *
 *
 *
 *
 *
 * work with an endpoint like this:
 * retrieve pic: /enpoint?get=pic-id
 *     return {uri:"/static/pic-name.jpg"}				if it exist
 *     return {error:true,msg:"picture don't exist"}	is pic dont exist
 * upload pic: /enpoint?upload&type=x
 * with type is a type id (to set a different location in the system)
 * _default to type 1_
 *     return {uploaded:true,id:2}
 * delete pic: /endpoint?del=pic-id
 *     return {deleted=true}							if deleted
 *     return {error=true,msg="pic can't be deleted"}	if error
*/
