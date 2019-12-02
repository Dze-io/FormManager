# Form Manager

A powerfull Manager for all your forms

## Table of Content

- [Form Manager](#form-manager)
  - [Table of Content](#table-of-content)
  - [Installation](#installation)
  - [usage](#usage)
    - [Typescript](#typescript)
  - [Modules & Attributes](#modules--attributes)
    - [Builtin Modules](#builtin-modules)
    - [Builtin Attributes](#builtin-attributes)
  - [Issues](#issues)
  - [Changelog](#changelog)
  - [Wiki](#wiki)

## Installation

nothing difficult.  
In you project simply run this command
```bash
yarn add @dzeio/form-manager
```
or
```bash
npm install @dzeio/form-manager
```

## usage

### Typescript

```ts
import FormManager from '@dzeio/form-manager';

const fm = new FormManager(document.getElementById("form"));
const am = fm.attributeManager; // The Attribute Manager
```

Add Modules 
```ts
import RepeatInput from '@dzeio/form-manager/modules/RepeatInput'
import IgnoreAttribute from '@dzeio/form-manager/attributes/IgnoreAttribute';

fm.assign(RepeatInput)
// and/or attributes
am.register(IgnoreAttribute)

// After adding modules/attributes run to reffect modules to inputs
fm.setupInputs();
am.setup();
```

Now You can launch any lines from below !
```ts
import { FMMode } from '@dzeio/form-manager'

// verify form validity
fm.verify(); //return true if valid else return false
// if it returns false you can use the variable under to see the first errored input
fm.lastErroredInput

// submit your data to an endpoint
fm.submit("/api/dzeio", (ev) => {/* onloaded callback*/})

// get the json of your form
fm.getJSON()

// fill form from URI
// datas MUST be in JSON (see getJSON for examples)
fm.fillFromURI("uri")

// same as before but you give the json from typescript
fm.fillFromJSON(json)

// change if you only see the form or edit them
fm.setMode(FMMode.ViewMode) // make form uneditable
fm.setMode(FMMode.EditMode) // Make form editable

// same thing as before but just for one field
fm.setModeForInput(FMMode.ViewMode, "inputName")
fm.setModeForInput(FMMode.EditMode, "inputName")

// Reset the form to it's defaults values
fm.clear()
```

## Modules & Attributes

You can create you own modules/attributes or use the builtin ones  
See [AbstractInput.ts](https://git.delta-wings.net/dzeio/FormManager/src/branch/master/src/modules/InputAbstract.ts) to get started on module creation  
And [AbstractAttribute.ts](https://git.delta-wings.net/dzeio/FormManager/src/branch/master/src/attributes/AttributeAbstract.ts) for attribute creation

### Builtin Modules

| Module name | Description |
| :---------: | :---------: |
| [Datalist](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.datalist) | Manage the datalist better than ever ! |
| [Date](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.date) | Manage the date element |
| [Repeat](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.repeat) | Make your fields repeatable ! |
| [Select](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.select) | Fix your Select |

### Builtin Attributes

| Attribute name | Description |
| :------------: | :---------: |
| [data-autoset](https://git.delta-wings.net/dzeio/FormManager/wiki/attributes.data-autoset) | Update your value in realtime |
| [data-default](https://git.delta-wings.net/dzeio/FormManager/wiki/attributes.data-default) | a better value than `value` |
| [data-ignore](https://git.delta-wings.net/dzeio/FormManager/wiki/attributes.data-ignore) | make an input field not submitted |
| [data-regex](https://git.delta-wings.net/dzeio/FormManager/wiki/attributes.data-regex) | Verify you value via regex |

## Issues

Complete listing [here](https://git.delta-wings.net/dzeio/FormManager/issues)

## Changelog

[Here](./CHANGELOG.md)

## Wiki

[Here](#form-manager)
