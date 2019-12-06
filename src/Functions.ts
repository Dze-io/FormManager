const evil = eval
/**
 * Eval string starting with `run:`
 *
 * @param str string to process
 * @param callback function executed if eval return a value
 * @returns `boolean` return if eval was executed or not
 */
export function evalF(str: string, callback?: (str: string) => void): boolean {
	if (str && str.startsWith("run:")) {
		let tmp = str.split("run:")[1]
		const res = evil(tmp)
		if (res && callback) callback(res)
		return true
	}
	return false
}

/**
 * Return the number value of an element of undefined if not correct
 *
 * @param str the string to transform
 */
export function toNumber(str: any): number | undefined {
	if (typeof str === "number") return str
	if (str === "" || typeof str !== "string") return undefined

	// str is a string
	if ((str.startsWith("0") || str.startsWith("+")) && str.length > 1) return undefined
	const n = Number(str)
	if (!isNaN(n)) {
		return n
	}
	return undefined
}

export function isNumber(el: any): boolean {
	return typeof toNumber(el) === "number"
}

export function toBoolean(str: any): boolean | undefined {
	if (typeof str === "boolean") return str
	if (str === "true") return true
	if (str === "false") return false
	return undefined
}

export function isBoolean(el: any): boolean {
	return typeof toBoolean(el) === "boolean"
}

export function strToNum(str: string): number | string {
	const n = toNumber(str)
	if (n) return n
	return str
}

export function realType(el: any): string|number|boolean|undefined {
	// If el is `null` or `undefined`
	if ((typeof el === "object" && el === null) || typeof el === "undefined") return undefined
	if (typeof el === "object" && el.hasOwnProperty("id")) {
		el = el.id
	}
	if (isNumber(el)) return toNumber(el)
	if (isBoolean(el)) return toBoolean(el)
	return el
}
