import FormManager from './FormManager'
import DatalistInput from './modules/DatalistInput'
import DateInput from './modules/DateInput'
import RepeatInput from './modules/RepeatInput'
import SelectInput from './modules/SelectInput'
import RegexAttribute from './attributes/RegexAttribute'
import IgnoreAttribute from './attributes/IgnoreAttribute'
import DefaultAttribute from './attributes/DefaultAttribute'
import AutosetAttribute from './attributes/AutosetAttribute'
import CheckboxInput from './modules/CheckboxInput'
import NumberInput from './modules/NumberInput'
import ErrorAttribute from './attributes/ErrorAttribute'

/**
 * This class is Mainly used for (non-npm) browser usage as it contains every buitins extensions
 *
 * @export
 * @class fm
 * @extends {FormManager}
 */
export default class fm extends FormManager {
	public constructor(form: HTMLFormElement) {
		super(form)
		this.assign(
			CheckboxInput,
			DatalistInput,
			DateInput,
			NumberInput,
			RepeatInput,
			SelectInput,
		)
		this.setupInputs()
		this.attributeManager.register(
			AutosetAttribute,
			DefaultAttribute,
			ErrorAttribute,
			IgnoreAttribute,
			RegexAttribute,
		)
		this.attributeManager.setup()
	}
}

(window as any).FormManager = fm
