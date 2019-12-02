import InputAbstract from "../InputAbstract";
import FormManager from "../../FormManager";

interface InputConstructor {
	new(element: HTMLElement, form: FormManager): InputAbstract
}

/**
 * Make an Input class different with the othes ones
 */
export default interface InputIdentity {

	/**
	 * The input
	 */
	input: InputConstructor

	/**
	 * the classes filters
	 */
	classes?: string[] | string

	/**
	 * The Attribute filters
	 */
	attributes?: string[] | string

	/**
	 * If it's an Input the type have to cerrespond
	 * to this
	 */
	type?: string

	/**
	 * the TagName used
	 *
	 * ex: `<div></div>` will be `DIV`
	 */
	tagName ?: string
}
