# AppInput

`AppInput` is a TypeScript class (also available as a ColdFusion CFC in [epl-customtags](https://github.com/jdlien/epl-customtags)) that generate flexible, accessible form inputs compatible with `@jdlien/validator`.
To use this class, create an instance of `AppInput` with the desired attributes and call its methods to generate HTML for form inputs.

## Basic Usage:

The first argument of the `AppInput` constructor is an object with input attributes. You may pass in any attributes you want, including standard HTML attributes, data attributes, etc., although some will be specially handled.

The following example creates a text input (the default) called 'input1' with an associated label.

```javascript
const inputEl = new AppInput({
  name: "input1",
  label: "My Input",
  placeholder: "Enter text here",
})
```

## Types

### `OptionType`

A flexible option type that can either be a string or an object. When provided as an object, it can contain the following properties:

- `value` (string): The value of the option. **(Required)**
- `label` (string): The display label of the option.
- `description` (string): A description of the option.
- `selected` (boolean): Whether the option is selected by default.

### `NormalizedOptionType`

A more strict option type used internally, defined as an object with:

- `value` (string): The value of the option. **(Required)**
- `label` (string): The display label of the option. **(Required)**
- `description` (string): A description of the option.
- `selected` (boolean): Whether the option is selected by default.

### `IAttributes`

An interface representing input attributes, with properties including but not limited to:

- `type`, `name`, `id`, `class`, `label`, `value`, `checked`
- `error`: A string indicating an error message.
- `description`: A description of the input.
- `required`: A boolean indicating if the input is required.
- `maxLength`: The maximum length of the input value.
- `placeholder`: Placeholder text for the input.
- `pattern`: A regex pattern the input value must match.
- `options`: An array of `OptionType` for select inputs.
- `horizontal`: A boolean indicating if options should be displayed horizontally.
- `noErrorEl`: A boolean to hide the error element.

### `AnyAttributes`

A record type allowing for any additional attributes to be added to an input.

## `AppInput` Class

The main class for creating input elements. It includes properties like:

- `hasEndTag`: Indicates if the input has an end tag.
- `type`: The type of the input.
- `name`, `label`, `value`, `error`: Basic input attributes.
- `required`, `fullWidth`, `horizontal`, `emptyOption`: Behavioral flags.
- `classDefault`, `errorClass`: CSS classes for styling.
- `options`: An array of normalized options for select inputs.

Constructor and methods:

- **constructor(attributes: IAttributes & AnyAttributes)**: Initializes a new instance of `AppInput` with the provided attributes.
- **generateId(attributes: IAttributes)**: Generates an ID based on provided attributes or creates a random one.
- **faIcon(iconName: string)**: Generates an HTML element string for a specified FontAwesome icon.
- **setupInputAttributes(attributes: IAttributes)**: Sets up and normalizes input attributes.
- **classAttr(elType: string, attributes: IAttributes)**: Returns a class attribute string for an element.
- **normalizeOptions(options: OptionType[])**: Normalizes an array of `OptionType` into `NormalizedOptionType`.
- **start()**: Starts the HTML output for the input, including the label and input element.
- **end()**: Adds the end tag for inputs that require it and returns the complete HTML.
- **getFormItem()**: Returns an HTMLDivElement representing the form item.
- **getFormItemHTML()**: Returns the outerHTML of the form item.

This class can be extended or modified to suit specific form input needs, providing a robust solution for dynamically generating form inputs in web applications.

```

```
