import { InputArrayInterface, FMAssignInterface } from './Interfaces';
import FMInput from "./FMInput"

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
 * **ATTENTION if multiple `option` has the same `value` attribute the `data-value` will be the one of the first one**
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
 * container: `.form-manager-repeat`
 * template (in container): `.form-manager-template`
 * add button (in container): `.form-manager-add-button`
 * delete button (in template): `.form-manager-delete-button`
 *
 * input MUST have data-name and not name attributes
 * if the script detect `[x]` it will be replaced by `[${index}]`
 * on item deletion all items are re-indexed
 * if `data-default` or `data-autoset` contains `{x}` it will be replaced by `${index}`
 *
 * check if input has attribute `form` and that the value is the current form id
 * if so add it to current form
 * ```html
 * <div class="fm-repeat" name="testName">
 *     <div class="fmr-template">
 *         <input data-input type="text"/>
 *         <!-- if there is only one input the name will be `testName[x]` -->
 *         <!-- if there is only multiple inputs the name will be `testName[x][index]` -->
 *         <div class="fmr-del">
 *             <button></button>
 *         </div>
 *     </div>
 *     <!-- future content position -->
 *     <div class="">
 *         <input data-input type="text"/>
 *         <div class="fmr-del">
 *             <button></button>
 *         </div>
 *     </div>
 *     <!-- future content position -->
 *     <div class="fmr-add">
 *         <button></button>
 *     </div>
 * </div>
 * ```
 */





/**
 * Manager for Forms
 *
 * @export
 * @class FormManager
 */
export default class FormManager {

	private inputs: InputArrayInterface = {}

	private FMInputs: FMAssignInterface[] = []

	private _form: HTMLFormElement
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

		//assign default form field
		this.assign({
			input: FMInput
		})

		//Setup for basic items
		this.setupInputs()
	}

	public assign(inter: FMAssignInterface) {
		this.FMInputs.unshift(inter)
	}

	public setupInputs() {
		this.form.querySelectorAll("[name]:not([data-name])").forEach((element: HTMLElement) => {
			let el = this.getInit(element)
			this.inputs[el.getName()] = el
		});
	}

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
	 * verify all the values
	 *
	 * @returns {boolean} if the requirements are correct or not
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
	 * submit the form to the `url`
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
	 * return the JSON `{key: value}` sequence
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
	 * fill form from uri
	 * future parameter will be the `type` of source datas (`JSON`, `XML`)
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
