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
		const res = eval(tmp)
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
export function toNumber(str: any): number|undefined {
	if (str !== 0 && (str === "" || str === undefined || typeof(str) === "boolean")) return undefined
	// return undefined if it must be shown as string
	// console.log("toNumber", str)
	if ((str.startsWith("0") || str.startsWith("+")) && str.length > 1) return undefined
	const n = Number(str)
	if (!isNaN(n)) {
		return n
	}
	return undefined
}

export function isNumber(el: any): boolean {
	// console.log(el)
	return typeof el === "number"
}

export function toBoolean(str: any): boolean|undefined {
	if (str === "true") return true
	if (str === "false") return false
	return undefined
}

export function strToNum(str: string): number|string {
	const n = toNumber(str)
	if (n) return n
	return str
}


export function realType(el: any): string|number|boolean {
	if (typeof el === "object" && el.hasOwnProperty("id")) {
		el = el.id
	}
	if (isNumber(el)) return el
	const isBool = toBoolean(el)
	const isNum = toNumber(el)
	return typeof isBool === "boolean" ? isBool : typeof isNum === "number" ? isNum : el
}
