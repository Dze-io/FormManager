# FormManager

A powerfull Manager for all your forms


## Table of Content <!-- omit in toc -->

- [FormManager](#formmanager)
  - [Base](#base)
  - [modules](#modules)
    - [datalist changes](#datalist-changes)
    - [date changes](#date-changes)
    - [Repeat Element](#repeat-element)
  - [TODO LIST](#todo-list)

## Base

to have the basic system just import `FormManager`

```ts
import FormManager from '@dzeio/form-manager';

const fm = new FormManager(docuement.getElementById("formId"))
```

from now on you can get datas by using `fm.getJSON()` fill by using `fm.fillFromJSON()` or `fm.fillFromURI()` verify datas with `fm.verify()`

## modules

Actually there is 3 modules included in the system _non of them are loaded_  
each modules add new functionality to the form (see later)

to load a module:
```ts
//the three modules availables
import { FMRepeatInputAssignment } from '@dzeio/form-manager/modules/FMRepeatInput'
import { FMDatalistAssignement } from '@dzeio/form-manager/modules/FMDatalistInput'
import { FMDateInputAssignement } from '@dzeio/form-manager/modules/FMDateInput'

// add the modules to the Form
fm.assign(FMRepeatInputAssignment)
fm.assign(FMDateInputAssignement)
fm.assign(FMDatalistAssignement)

// reload the manager to use the new modules
fm.setupInputs()

```

you can customise how the module assign himself to an element by doing this:
```ts
/*
    input: typeof FMInput
    classes?: string[] | string
    attributes?: string[] | string
    type?: string
    tagName?: string
*/
fm.assign({
    input: FMRepeatInput,
    classes: "custom-class",
    attributes: "data-custom",
    type: "number", //for input
    tagName: "div"
})
```

### datalist changes

the values for the datalist will not be the `value` attribute anymore but a `data-value` so the end user will see wht you wnt and not the value you want to send

even if you set `data-strict` the result value will only be set if it's from one of the option  
if not set the value will stay set by what the user wrote
***ATTENTION if multiple `option` has the same `value` attribute the final value will be the `data-value` of the first `value`***

ex:
```html
 <input name="listing" list="list" data-strict/>
 <datalist id="list">
     <option data-value="value submitted" value="shown value">value subtitle</option>
     <option data-value="value submitted" value="shown valuee">value subtitle</option>
     <option data-value="value submitted" value="shown valueq">value subtitle</option>
     <option data-value="value submitted" value="shown valuea">value subtitle</option>
 </datalist>
```

### date changes

`FMDateInput` change the result type from a string to a `Date` object  
and if `data-default` is set the current date will be set

ex:
```html
<input type="date" name="date" data-default />
```

### Repeat Element

the Repeat element allow to add/delete multiple time the sames input(s)

***NOTE***_: actually the filling don't work but the rest work just fine_

Organisation
```html
<div class="fm-repeat" name="repeat-element"> <!-- container -->
    <div class="fmr-template"> <!-- template container (won't show) -->
        <input data-input type="text"/> <!-- data-input replace the name element -->
        <!-- if there is only one input the name will be `testName[x]` with `x` being the index -->
        <!-- if there is only multiple inputs the name will be `testName[x][index]` -->
        <div class="fmr-del"> <!-- delete button container -->
            <button></button>
        </div>
    </div>
    <!-- future content position -->
    <!-- EXample content from above
    <div>
        <input data-input type="text"/>
        <div class="fmr-del">
            <button></button>
        </div>
    </div>
    -->
    <!-- future content position -->
    <div class="fmr-add"> <!-- container for add button -->
        <button></button>
    </div>
</div>
```

## TODO LIST

more Listing [here](https://git.delta-wings.net/dzeio/FormManager/issues)

- [ ] add `data-autoset` to autofill the input with data from another one _with `readonly` and `disabled`_
- [ ] allow filling of `FMRepeatInput`
- [ ] add `data-regex` for verification
- [ ] add `data-ignore` mainly for `data-autoset`
