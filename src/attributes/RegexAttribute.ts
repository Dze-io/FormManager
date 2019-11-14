import AttributeIdentity from './Interfaces/AttributeIdentity';
import AttributeAbstract from './AttributeAbstract';
import AttributeListeners from "./AttributeListeners";

export default class RegexAttribute
extends AttributeAbstract {
	public trigger(): boolean {
		const regStr = this.input.element.dataset.regex
		if (!regStr) return true
		const regex = new RegExp(regStr, "g")
		const test = this.input.getValue() + ""
		console.log(test)
		return regex.test(test)
	}

	public static listeners: AttributeListeners[] = [
		AttributeListeners.VERIFY
	]

	public static identity: AttributeIdentity = {
		attribute: RegexAttribute,
		dataElement: "data-regex"
	}
}
