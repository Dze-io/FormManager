import FormManager from "./FormManager";
import InputAbstract from "./modules/AbstractInput";
import AbstractAttribute from "./attributes/AbstractAttribute";
import AttributeIdentity from "./attributes/Interfaces/AttributeIdentity";
import AttributeListeners from "./attributes/AttributeListeners";

export default class AttributesManager {

	private form: FormManager

	private attributesArray: AttributeIdentity[] = []

	private eventsListenersItems: listenerItems = {}

	public constructor(form: FormManager) {
		this.form = form
	}

	public register(...attribute: typeof AbstractAttribute[]) {
		for (const attr of attribute) {
			this.attributesArray.push(attr.identity)
		}
		return this
	}

	public trigger(event: AttributeListeners, data?: any): boolean {
		if (!this.eventsListenersItems[event]) return true
		for (const el of this.eventsListenersItems[event]) {
			el.trigger(event, data)
		}
		return true
	}

	public triggerElement(event: AttributeListeners, input: InputAbstract, data?: any): boolean|object {
		if (!this.eventsListenersItems[event]) return true
		for (const el of this.eventsListenersItems[event]) {
			if (el.input === input) {
				const res = el.trigger(event, data)
				if (typeof res !== "undefined") return res
			}
		}
		return true
	}

	public onChange(ev:KeyboardEvent|Event) {
		const target = ev.target
		if (target) {
			this.trigger(AttributeListeners.CHANGE, this.form.inputs[(target as any).name])
		}
	}

	public onUnfocus(ev:FocusEvent) {
		const target = ev.target
		if (target) {
			this.triggerElement(AttributeListeners.INPUT_UNFOCUS, this.form.inputs[(target as HTMLInputElement).name])
		}
	}

	// private onChange

	public setup() {
		// for each inputs
		for (const name in this.form.inputs) {
			if (!this.form.inputs.hasOwnProperty(name)) {
				continue
			}
			const el = this.form.inputs[name];
			el.element.removeEventListener("keyup", ev => this.onChange(ev))
			el.element.addEventListener("keyup", ev => this.onChange(ev))
			el.element.removeEventListener("change", ev => this.onChange(ev))
			el.element.addEventListener("change", ev => this.onChange(ev))
			el.element.removeEventListener("focusout", ev => this.onUnfocus(ev))
			el.element.addEventListener("focusout", ev => this.onUnfocus(ev))

			// loop through assignments
			for (const key in this.attributesArray) {
				if (!this.attributesArray.hasOwnProperty(key)) {
					continue
				}
				const element = this.attributesArray[key];
				if (el.element.hasAttribute(element.dataElement)) {
					let list = new element.attribute(el)
					for (const listener of element.attribute.listeners) {
						if (this.eventsListenersItems[listener] === undefined) this.eventsListenersItems[listener] = []
						this.eventsListenersItems[listener].push(list)
					}
				}
			}

		}
	}
}

interface listenerItems {
	[key:string]: AbstractAttribute[]
}
