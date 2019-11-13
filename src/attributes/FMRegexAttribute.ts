import FMAttribute, { FMAttributeListeners, FMAttributeAssignment } from "../FMAttribute";

export default class FMRegexAttribute
extends FMAttribute {
	public trigger(): boolean {
		const regStr = this.input.element.dataset.regex
		if (!regStr) return true
		const regex = new RegExp(regStr, "g")
		const test = this.input.getValue() + ""
		console.log(test)
		return regex.test(test)
	}

	public static listeners: FMAttributeListeners[] = [
		FMAttributeListeners.VERIFY
	]
}

export const FMRegexAttributeAssignment: FMAttributeAssignment = {
	attribute: FMRegexAttribute,
	dataElement: "data-regex"
}
