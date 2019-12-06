import AttributeIdentity from './Interfaces/AttributeIdentity';
import InputAbstract from "../modules/AbstractInput";
import AttributeListeners from "./AttributeListeners";

export default abstract class AbstractAttribute {

	public input: InputAbstract

	public static listeners: AttributeListeners[]
	public static identity: AttributeIdentity

	public constructor(input: InputAbstract) {
		this.input = input
	}

	/**
	 * Function launched on Listener trigger
	 * it MUST be implemented and SHOULD return boolean
	 *
	 * @param ev Attribue triggered
	 */
	public abstract trigger(event: AttributeListeners, data?: any): object|boolean|void
}
