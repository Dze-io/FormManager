import InputIdentity from './Interfaces/InputIdentity';
import DefaultInput from './DefaultInput';
import { realType } from '../Functions';
import FormManager from '../FormManager';

export default class SelectInput extends DefaultInput {

	public constructor(element: HTMLSelectElement, form: FormManager) {
		super(element, form)
		if (element.hasAttribute('data-datalist')) {
			const datalist = document.querySelector(`#${element.dataset.datalist}`)
			if (!datalist) {
				console.warn('Error, Datalist does not exist')
			} else {
				// @ts-ignore
				for (const child of element.children) {
					!(child as HTMLElement).hasAttribute('disabled') && child.remove()
				}
				// @ts-ignore
				for (const child of datalist.children) {
					// console.log(child.value)
					element.appendChild(child.cloneNode(true))
				}
			}
		}
		if (element.dataset.filterElement) {
			const options = element.querySelectorAll('option')
			const el = form.form.querySelector<HTMLInputElement>(`[name="${element.dataset.filterElement}"]`)
			if (!el) {
				console.warn(`Select Input has filter Attr but can't find the element (${element.dataset.filterElement})`)
			} else {
				const fn = () => {
					options.forEach((opt) => {
						if (opt.dataset.filter === el.value || opt.dataset.filter === undefined) {
							opt.removeAttribute('style')
						} else {
							opt.style.display = 'none'
							if (this.formatValue(opt.value) === this.getValue()) {
								this.setValue(undefined)
							}
						}
					})
				}
				el.addEventListener('change', fn)
				fn()
			}
		}
	}

	public setValue(value: any) {
		this.element.value = this.formatValue(value)
	}

	public formatValue(value: any): any {
		if (typeof value !== "undefined" && value !== "") {
			return realType(value)
		}
		const opt = this.element.querySelector("option[selected]") || undefined
		if (opt) {
			return (opt as HTMLOptionElement).value
		}
		throw Error(":O it should never come here")
	}

	public static identity: InputIdentity = {
		input: SelectInput as any,
		tagName: "select"
	}
}
