import InputIdentity from "./Interfaces/InputIdentity"
import DefaultInput from "./DefaultInput"
import FormManager from "../FormManager"

export default class TextAreaInput extends DefaultInput {

	public constructor(element: HTMLElement, form: FormManager) {
		super(element, form)
		element.style.resize = 'none'
		const event = () => {
			element.style.minHeight = "5px"
			element.style.minHeight = `calc(2em + ${element.scrollHeight+5}px)`
		}
		;(element as HTMLTextAreaElement).addEventListener('keydown', event)
		;(element as HTMLTextAreaElement).addEventListener('keypress', event)

	}

	public static identity: InputIdentity = {
		input: TextAreaInput,
		tagName: 'textarea',
		attributes: 'data-autoresize'
	}
}
