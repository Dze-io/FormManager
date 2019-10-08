import { InputArrayInterface, FMAssignInterface } from './Interfaces';
import FMInput from "./FMInput"

/*!
 * FormManager by DZEIO's team
 * MIT Licensed
 * https://dze.io
 */

/**
 *
 * `datalist` upgrade:
 * the value submitted won't be the `value` attribute but the `data-value` attribute
 * a `data-strict` attribute if set will return undefined if input value is not from data-value else it will return the input value if not foudn in options
 * ex:
 * ```html
 * <input name="listing" list="list" data-strict/>
 * <datalist id="list">
 *     <option data-value="value submitted" value="shown value">value subtitle</option>
 *     <option data-value="value submitted" value="shown valuee">value subtitle</option>
 *     <option data-value="value submitted" value="shown valueq">value subtitle</option>
 *     <option data-value="value submitted" value="shown valuea">value subtitle</option>
 * </datalist>
 * ```
 * **ATTENTION if multiple `option` have the same `value` attribute the submitted value will be the first one**
 *
 *
 * a `data-ignore` attribute:
 * the input with the data-ignore won't send datas to server _still need the `name` attribute_
 * awesome for usage with `data-autoset`
 *
 * a `data-regex` attribute:
 * when the element is getting verified it will be passed through the regex
 * ex:
 * ```html
 * <!-- value is set by the user -->
 * <input type="text" value="00" data-regex="\d" />
 * <!-- test passed form will submit -->
 * <input type="text" value="O0" data-regex="\d" />
 * <!-- error regex not corresponding form won't submit -->
 * ```
 * _please note that you still have to verify that server-side_
 *
 *
 * a `data-default` attribute:
 * if the value is not something controlable by html it will be set by here
 * depending on the input type different defaults are possibles
 * ex: `date` `datetime` `time` if it's set it will be the current time
 * ```html
 * <input type="date" name="date" data-default />
 * <!-- will result if today was the 2019-08-26 in -->
 * <input type="date" name="date" data-default value="2019-08-26"/>
 * ```
 *
 *
 * a `data-autoset` attribute:
 * this attribute will change it's value regarding other inputs
 * DON'T name any input `x` as it will break the repeat element
 * (you SHOULD use `readonly` or `disabled` attribute with it)
 * ex:
 * ```html
 * <input name="input"/>
 * <input name="test" readonly data-autoset="testing-autoset-{input}"/>
 * ```
 * the test input should always contain `testing-autoset-(the value of input)
 *
 *
 * a `repeat` type:
 * container: `.fm-repeat` with a name attribute
 * template (in container): `.fmr-template`
 * element (DO NOT PLACE IT YOURSELF) (in container): `.fmr-element`
 * add button (in container): `.fmr-add`
 * delete button (in template): `.fmr-del`
 *
 * input *MUST* have `data-name` and *NOT* `name` attributes
 * if `data-default` or `data-autoset` contains `{x}` it will be replaced by the index
 *
 * ```html
 * <div class="fm-repeat" name="testName">
 *     <div class="fmr-template example-class">
 *         <input data-input data-name="name" type="text"/>
 *         <!-- if there is only one input the result will be an array of values -->
 *         <!-- if there is only multiple inputs the result will be a named array of results -->
 *         <div class="fmr-del">
 *             <button></button>
 *         </div>
 *     </div>
 *     <div class="example-class fmr-element">
 *         <input data-input data-name="name" type="text"/>
 *         <button class="fmr-del"></button>
 *     </div>
 *     <!-- future elements will always be placed before `.fmr-add` -->
 *     <button class="fmr-add"></button>
 * </div>
 * ```
 *
 *
 * TODO:
 * check if input has attribute `form` and that the value is the current form id
 * if so add it to current form
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
	 * @type {InputArrayInterface}
	 * @memberof FormManager
	 */
	private inputs: InputArrayInterface = {}

	/**
	 * List of interfaces
	 *
	 * @private
	 * @type {FMAssignInterface[]}
	 * @memberof FormManager
	 */
	private FMInputs: FMAssignInterface[] = []

	private _form: HTMLFormElement
	/**
	 * The Form Element of the FM
	 *
	 * @private
	 * @type {HTMLFormElement}
	 * @memberof FormManager
	 */
	public set form(v : HTMLFormElement) {this._form = v}
	public get form(): HTMLFormElement {return this._form}

	/**
	 * Creates an instance of FormManager.
	 * @param {HTMLFormElement} form the form HTMLElement
	 * @memberof FormManager
	 */
	constructor(form: HTMLFormElement) {
		this.form = form

		//Prevent default submit action
		form.onsubmit = (e) => {
			e.preventDefault()
		}

		//assign default form interface
		this.assign({
			input: FMInput
		})

		//Setup the system for basic inputs
		this.setupInputs()
	}

	/**
	 * Add the the FM an Input Manager
	 *
	 * @param {FMAssignInterface} inter the interface used
	 * @memberof FormManager
	 */
	public assign(inter: FMAssignInterface) {
		this.FMInputs.unshift(inter)
	}

	/**
	 * Setup the differents inputs to be used with their interfaces
	 *
	 * @memberof FormManager
	 */
	public setupInputs() {
		this.form.querySelectorAll("[name]:not([data-name])").forEach((element: HTMLElement) => {
			let el = this.getInit(element)
			this.inputs[el.getName()] = el
		});
	}

	/**
	 * Retrieve a specific FMInput for a Specific Input
	 *
	 * @param {HTMLElement} element
	 * @returns {FMInput}
	 * @memberof FormManager
	 */
	public getInit(element: HTMLElement): FMInput {
		inputsLoop: for (const input of this.FMInputs) {
			if (input.classes != undefined) {
				let tmpList: string[]
				if (typeof input.classes == "object") tmpList = input.classes
				if (typeof input.classes === "string") tmpList = [input.classes]
				for (const classe of tmpList) {
					if(!element.classList.contains(classe)) continue inputsLoop
				}
			}
			if (input.attributes != undefined) {
				let tmpList: string[]
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
				if(!input.verify()) return false
			}
		}
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
	public submit(url: string, callback?: (this: XMLHttpRequest, ev: ProgressEvent) => any, verify: boolean = true): boolean {
		if (verify && !this.verify()) return false
		let ajax = new XMLHttpRequest
		ajax.open("POST", url, true)
		ajax.setRequestHeader("Content-Type", "application/json")
		if (callback != undefined) ajax.addEventListener("loadend", callback)
		ajax.send(JSON.stringify(this.getJSON()))
		return true
	}

	/**
	 * Return the JSON `{key: value}` sequence
	 *
	 * @memberof FormManager
	 */
	public getJSON(): any {
		const jsonObject:any = {}
		for (const name in this.inputs) {
			if (this.inputs.hasOwnProperty(name)) {
				const input = this.inputs[name];
				jsonObject[name] = input.getValue()
			}
		}
		return jsonObject
	}

	/**
	 * Fill the form from JSON
	 *
	 * Hint: _to see what the json is made of use `fm.getJSON`_
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
	}

	/**
	 * fill form from an `uri`
	 *
	 * the format MUST be `JSON`
	 *
	 * @param {string} uri the URI
	 * @memberof FormManager
	 */
	public fillFromURI(uri: string) {
		let ajax =  new XMLHttpRequest
		ajax.open("GET", uri, true)
		ajax.addEventListener("loadend", (e) => {
			if (ajax.readyState === 4 && ajax.status === 200) {
				let json = JSON.parse(ajax.responseText)
				this.fillFromJSON(json)
			}
		})
		ajax.send()
	}

	/**
	 * Clear the fields in the form
	 *
	 * @memberof FormManager
	 */
	public clear() {
		this.form.querySelectorAll("[name]").forEach((el: HTMLInputElement) => {
			el.value = ""
			el.removeAttribute("value")
		})
	}
}


/**
 * TODO: FMFileInput
 * have a data-endpoint with an URI
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
 * upload pic: /enpoint?upload
 *     return {uploaded:true,id:2}
 * delete pic: /endpoint?del=pic-id
 *     return {deleted=true}							if deleted
 *     return {error=true,msg="pic can't be deleted"}	if error
*/
