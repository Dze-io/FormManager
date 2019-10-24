# Form Manager

A powerfull Manager for all your forms

## Table of Content

- [Form Manager](#form-manager)
  - [Table of Content](#table-of-content)
  - [Installation](#installation)
  - [usage](#usage)
    - [Typescript](#typescript)
  - [Modules & Attributes](#modules--attributes)
    - [Modules](#modules)
    - [Attributes](#attributes)
  - [Issues](#issues)
  - [Changelog](#changelog)

## Installation

nothing difficult

```bash
yarn add @dzeio/form-manager
or
npm install @dzeio/form-manager
```

## usage

### Typescript

```ts
import FormManager from '@dzeio/form-manager';

const fm = new FormManager(docuement.getElementById("form"));

// add modules
import { FMRepeatAssignment } from '@dzeio/FormManager/modules/FMRepeatInput'

fm.assign(FMRepeatAssignment)

// or

import FMDateInput from '../FormManagerGit/modules/FMDateInput'
fm.assign({
    input: FMDateInput,
    type: "date",
    tagName: "input"
});

// After adding modules run to reffect modules to inputs
fm.setupInputs();

// verify form validity:
fm.verify(); //return true if valid else return false
// if it returns false you can use the variable under to see th FMInput that isnt valid
fm.lastErroredInput

// submit your data to an endpoint
fm.submit("/api/idk", (ev) => {/* onloaded callback*/}, /* verify datas beforehand default:true*/ true)

// get the json of your form
fm.getJSON()

// fill form from URI (datas MUST be in JSON (see getJSON for examples))
fm.fillFromURI("uri")

// same as before but you give the json from ts
fm.fillFromJSON(json)

// change if you only see the form or edit them
fm.setMode(FMMode.ViewMode or FMMode.EditMode)

// same thing as before but just for one field
fm.setModeForInput(FMMode.ViewMode or FMMode.EditMode, "inputName")

// Reset the form to it's defaults values
fm.clear()

```

## Modules & Attributes

### Modules

| Module name | Description |
| :---------: | :---------: |
| [Datalist](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.datalist) | Manage the datalist better than ever ! |
| [Date](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.date) | Manage the date element |
| [File](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.file) | Manage single file uploads |
| [Repeat](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.repeat) | Make your fields repeatable ! |
| [Select](https://git.delta-wings.net/dzeio/FormManager/wiki/modules.select) | Fix your Select |

### Attributes

| Attribute name | Description |
| :------------: | :---------: |
| [data-autoset](https://git.delta-wings.net/dzeio/FormManager/wiki/attribute.data-autoset) | Update your value in _near_ realtime |
| [data-default](https://git.delta-wings.net/dzeio/FormManager/wiki/attribute.data-default) | a better value than `value` |
| [data-ignore](https://git.delta-wings.net/dzeio/FormManager/wiki/attribute.data-ignore) | i don't see this |
| [data-regex](https://git.delta-wings.net/dzeio/FormManager/wiki/attribute.data-regex) | regex your value |

## Issues

Complete listing [here](https://git.delta-wings.net/dzeio/FormManager/issues)

## Changelog

[here](./CHANGELOG.md)
