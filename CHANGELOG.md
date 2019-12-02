# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
### Changed
### Fixed
### Removed

## [0.3.0] - 2019-12-02

### Added

- Attribute Manager
  - attribute Abstract to create new Attributes
  - AttributeListeners that are the list of listeners
  - Multiple event listeners to the Attribute Manager
  - AutosetAttribute
- fm.mode to get the active mode
- Function file with utility functions
- Better description of `package.json`

### Changed

- Input inheritance from `FMInput` to `InputAbstract`
- all the input names now don't starts with `FM`

### Fixed

- AutosetAttribute not supporting text variables

### Removed

- `interface.ts` file

## [0.2.1] - 2019-10-24

### Changed

- changed location of files to make it easier to use !

## [0.2.0] - 2019-10-24

### Added

- .gitignore
- .npmignore
- CHANGELOG.md
- CONTRIBUTING.md
- LICENSE.md
- README.md
- too much things

### Changed

- everything

### Fixed

- everything

## [0.1.0] - 2019-08-27

### Added

- FormManager
  - assign
  - setupInputs
  - getInit
  - verify
  - submit
  - getJSON
  - fillFromJSON
  - fillFromURI
  - clear
- Interfaces
  - InputArrayInterface
  - FMAssignInterface
- FMInput
  - setValue
  - getValue
  - getDefault
  - getName
  - verify
- modules
  - FMRepeatInput
    - loopInputs
    - setValue
    - getValue
    - Assignement
  - FMDateInput
    - setValue
    - getValue
    - getDefault
    - Assignement
  - FMDatalistInput
    - setValue
    - getValue
    - Assignement
<!-- [Unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.0.0...HEAD -->
[0.2.1]: https://git.delta-wings.net/dzeio/FormManager/src/tag/0.2.1
[0.2.0]: https://git.delta-wings.net/dzeio/FormManager/src/tag/0.2.0
[0.1.0]: https://git.delta-wings.net/dzeio/FormManager/src/tag/0.1.0
