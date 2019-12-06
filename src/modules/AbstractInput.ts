import FormManager from "../FormManager";
import InputIdentity from "./Interfaces/InputIdentity";

export default abstract class InputAbstract {

	public element: HTMLInputElement
	public form: FormManager

	public constructor(element: HTMLElement, form: FormManager) {
		this.element = element as HTMLInputElement
		this.form = form
	}

	/**
	 * Set the element Value
	 *
	 * _hint: pass it through this.formatValue_
	 *
	 * @param {*} value the input value
	 * @memberof FMInput
	 */
	public abstract setValue(value: any): void

	/**
	 * Get the element value
	 *
	 * @returns {*} the value
	 * @memberof FMInput
	 */
	public abstract getValue(): any

	/**
	 * Format the value into a usable one by the module
	 *
	 * for elements like `select` if the value don't correspond to something
	 * it will return the default `value`
	 *
	 * @param {*} value
	 * @returns {*}
	 * @memberof FMInput
	 */
	public abstract formatValue(value: any): any

	/**
	 * Retrieve the input name
	 *
	 * name can be located at multiple locations like `name` attribute or `data-name` attribute
	 *
	 * @returns {string}
	 * @memberof FMInput
	 */
	public abstract getName(): string

	/**
	 * Verify if the element is correct
	 *
	 * @returns {boolean}
	 * @memberof FMInput
	 */
	public abstract verify(): boolean


	public static identity: InputIdentity
}
