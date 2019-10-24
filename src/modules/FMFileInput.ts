import { FMAssignInterface } from '../Interfaces';
import FMInput from "../FMInput"
import FormManager from '../FormManager';

/**
 *
 * @class FMFileInput
 * @extends {FMInput}
 */
export default class FMFileInput extends FMInput {

	isUploaded = false

	type = 1



	button: HTMLButtonElement

	constructor(element: HTMLInputElement, form: FormManager) {
		super(element, form)

		this.type = this.element.dataset.uploadType ? parseInt(this.element.dataset.uploadType): 1

		element.addEventListener("change", () => {
			console.log("pouet")
			let files = element.files
			if (files && element.parentElement && files.length > 0) {
				const name = element.parentElement.querySelector(".file-name")
				if (name) name.textContent = files[0].name
			}
		})

		if (this.element.hasAttribute("data-button") && element.parentElement && element.dataset.button) {
			let btn = element.parentElement.querySelector(element.dataset.button)
			this.button = btn ? btn as HTMLButtonElement : undefined
			// this.button = element.parentElement.querySelector(element.dataset.button)
		}

		if (this.button) {
			this.button.addEventListener("click", () => {
				if (!this.element.disabled) {
					console.log("pouet!")
					this.upload()
				}
			})
		}


	}

	upload() {
		// if (this.form.getJSON()["id"] == 0 || this.form.getJSON()["id"] == undefined) {
		// 	NotificationManager.getNotificationManager().add("Merci de sauvegarder l'offre au moins une fois !")
		// }
		let files = this.element.files
		if (files && files.length > 0) {
			const file = files[0]
			const ajax = new XMLHttpRequest
			let form = new FormData
			form.append(this.getName(), file, file.name)
			ajax.open("POST", `/api/file?upload&type=${this.type}`)
			ajax.addEventListener("load", (ev) => {
				console.log(ev)
			})
			ajax.addEventListener("progress", (ev) => {
				console.log(ev)
			})
			ajax.addEventListener("loadstart", () => {
				if (this.button) this.button.classList.add("is-loading")
				if (!this.element.hasAttribute("disabled")) {
					this.element.setAttribute("disabled", "")
					this.element.setAttribute("data-uploading", "")
				}
			})
			ajax.addEventListener("loadend", () => {
				if (this.button) this.button.classList.remove("is-loading")
				if (this.element.hasAttribute("disabled") && this.element.hasAttribute("data-uploading")) {
					this.element.removeAttribute("disabled")
					this.element.removeAttribute("data-uploading")
				}
				if (this.button) this.button.innerText = "Uploaded!"
				this.element.dataset.id = JSON.parse(ajax.responseText).id
				ajax.responseText
			})
			ajax.send(form)
		}
	}

	setValue(value: string|number) {
		if (value == "") {
			this.element.dataset.id = value + ""
			if (this.element.parentElement) {
				const name = this.element.parentElement.querySelector(".file-name")
				if (name) name.textContent = ""
			}
		}

	}

	getValue(): number {
		return this.element.dataset.id ? parseInt(this.element.dataset.id):0
	}

	verify() {
		if (this.element.hasAttribute("required")) {
			return this.isUploaded
		}
		return true
	}

}

export const FMFileAssignement: FMAssignInterface = {
	input: FMFileInput,
	type: "file",
	tagName: "input"
}
