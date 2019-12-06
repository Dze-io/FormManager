import AbstractInput from "../AbstractInput";

/**
 * this interface is used for fetching and setting `name` to `FMInput` link
 *
 * @interface InputArray
 */
export default interface InputArray {
	[key: string]: AbstractInput
}
