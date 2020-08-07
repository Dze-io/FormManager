import AbstractInput from "../AbstractInput";

/**
 * this interface is used for fetching and setting `name` to `FMInput` link
 *
 * @interface InputArray
 */
type InputArray<T = Record<string, any>> = Record<keyof T, AbstractInput>

export default InputArray
