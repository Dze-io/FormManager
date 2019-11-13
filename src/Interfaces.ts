import FMInput from "./FMInput"

/**
 * this interface is used for fetching and setting `name` to `FMInput` link
 *
 * @interface InputArray
 */
export interface InputArray {
	[key: string]: FMInput
}

/**
 * this interface is used when adding a new `FMInput` class to the FormManager
 *
 * @interface FMAssignInterface
 */
export interface FMAssignInterface {
	input: typeof FMInput
	classes?: string[] | string
	attributes?: string[] | string
	type?: string
	tagName?: string
}

export interface InputAssignment {
	input: typeof FMInput
	classes?: string[] | string
	attributes?: string[] | string
	type?: string
	tagName?: string
}
