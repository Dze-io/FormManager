import { realType } from "../Functions"
import InputAbstract from "./InputAbstract"
import InputIdentity from "./Interfaces/InputIdentity"

export default class DefaultInput extends InputAbstract {

	public setValue(value: any) {
		this.element.value = this.formatValue(value)
	}

	public getValue(): any {
		return this.formatValue(this.element.value)
	}

	public formatValue(value: any): any {
		// if the value is a number return it as a number obj
		return realType(value)
	}

	public getName(): string {
		// while we search for inputs containing [name] we search for the input real name in [name] or [data-name]
		// (Allow other inputs to play with inputs)
		let attr = this.element.getAttribute("name") || this.element.dataset.name;
		if (attr) return attr
		throw Error("Error: could not get input name!")
	}

	public verify(): boolean {
		let val: any = this.getValue()
		// if element is required and value is undefined retur false
		if (this.element.hasAttribute("required") && (val === undefined || val === null || val === "")) return false

		return true
	}

	public static identity: InputIdentity = {
		input: DefaultInput
	}
}
