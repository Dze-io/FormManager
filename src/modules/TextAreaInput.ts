import InputIdentity from "./Interfaces/InputIdentity"
import DefaultInput from "./DefaultInput"
import FormManager from "../FormManager"

export default class TextAreaInput extends DefaultInput {

	public constructor(element: HTMLElement, form: FormManager) {
		super(element, form)
		element.style.resize = 'none'

		;(element as HTMLTextAreaElement).addEventListener('keydown', this.event)
		;(element as HTMLTextAreaElement).addEventListener('keypress', this.event)
	}

	private event = () => {
		this.element.style.minHeight = "5px"
		this.element.style.minHeight = `calc(2em + ${this.element.scrollHeight+5}px)`
	}

	public setValue(value: any) {
		this.event()
		this.element.value = this.formatValue(value) || ""
	}

	public static identity: InputIdentity = {
		input: TextAreaInput,
		tagName: 'textarea',
		attributes: 'data-autoresize'
	}
}
