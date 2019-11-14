enum AttributeListeners {
	PRE_CLEAR, // Event run before clearing the form
	POST_CLEAR, // Event run after learing the form
	CHANGE, // Event runs on Form Change (datas wil be filled with the FMInput element)
	FORM_INIT, // Event runs on form init
	FORM_SUBMIT, // Event run before submitting (datas is filled with the datas that will be submitted, MUST return TriggerCallback)
	VERIFY, // Event run on element verification (return true or false only)
	FORM_FILL, // Event run after the form was filled
}

export default AttributeListeners
