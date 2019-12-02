import FormManager from "./FormManager";
import InputAbstract from "./modules/InputAbstract";
import AttributeAbstract from "./attributes/AttributeAbstract";
import AttributeIdentity from "./attributes/Interfaces/AttributeIdentity";
import AttributeListeners from "./attributes/AttributeListeners";

export default class AttributesManager {

	public static instance: AttributesManager

	private form: FormManager

	private attributesArray: AttributeIdentity[] = []

	private eventsListenersItems: listenerItems = {}

	public constructor(form: FormManager) {
		this.form = form
		AttributesManager.instance = this
	}

	public register(...attribute: typeof AttributeAbstract[]) {
		for (const attr of attribute) {
			this.attributesArray.push(attr.identity)
		}
	}

	public trigger(event: AttributeListeners, data?: any): boolean|object {
		if (!this.eventsListenersItems[event]) return true
		for (const el of this.eventsListenersItems[event]) {
			const res = el.trigger(event, data)
			if (typeof res !== "undefined") return res
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

	public onChange(this: HTMLInputElement) {
		const self = AttributesManager.instance
		self.trigger(AttributeListeners.CHANGE, self.form.inputs[this.name])
	}

	// private onChange

	public setup() {
		// for each inputs
		for (const name in this.form.inputs) {
			if (!this.form.inputs.hasOwnProperty(name)) {
				continue
			}
			const el = this.form.inputs[name];
			el.element.removeEventListener("keyup", this.onChange)
			el.element.addEventListener("keyup", this.onChange)
			el.element.removeEventListener("change", this.onChange)
			el.element.addEventListener("change", this.onChange)

			// loop through assignments
			for (const key in this.attributesArray) {
				if (!this.attributesArray.hasOwnProperty(key)) {
					continue
				}
				const element = this.attributesArray[key];
				if (el.element.hasAttribute(element.dataElement)) {
					let list = new element.attribute(el)
					for (const listener of element.attribute.listeners) {
						if (this.eventsListenersItems[listener] == undefined) this.eventsListenersItems[listener] = []
						this.eventsListenersItems[listener].push(list)
					}
				}
			}

		}
	}
}

interface listenerItems {
	[key:string]: AttributeAbstract[]
}
