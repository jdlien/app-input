# AppInput

`AppInput` is a TypeScript class (also available as a ColdFusion CFC in [epl-customtags](https://github.com/jdlien/epl-customtags)) that generates flexible, accessible form inputs compatible with `@jdlien/validator`.

For the full experience, with validation and other features, use this class in conjunction with `@jdlien/validator` by passing the form containing the inputs to the `Validator` constructor.

## Demo

[Working demo on jdlien.com](https://jdlien.com/app-input/demo/)

## Basic Usage:

To use this class, create an instance of `AppInput` with the desired attributes and call its methods to generate HTML for form inputs.

The first argument of the `AppInput` constructor is an object with input attributes. You may pass in any attributes you want, including standard HTML attributes, data attributes, etc., although some will be specially handled.

The following example creates a text input DOM element named 'input1' with an associated label. You can pass an argument to the `getFormItem` method to specify the classList of the form item.

```javascript
const inputEl = new AppInput({
  name: 'input1',
  label: 'My Input',
  placeholder: 'Enter text here',
}).getFormItem('form-item')
```

You can also pass the form element to the `appendToForm` method to append the input to the form.

```javascript
const form = document.getElementById('id-of-form')

new AppInput({
  type: 'select',
  label: 'Choose An Option',
  options: ['Option 1', 'Option 2', 'Option 3'],
}).appendToForm(form, 'form-item')
```

And you can also get the raw HTML of the form item with the `getFormItemHTML` method.

```javascript
inputHTML = new AppInput({
  type: 'textarea',
  label: 'My Textarea',
  placeholder: 'Enter text here',
}).getFormItemHTML('form-item')
```

## Types

One of the most important attributes to be passed to the `AppInput` constructor is the `type` attribute. This attribute determines the type of input to be generated. Although you can pass any value you want, the following types are explicitly supported with special features:

- `input`: A basic text input. (Default)
- `select`: A select dropdown input, which supports the `options` attribute.
- `textarea`: A textarea input supporting multiple lines.
- `checkbox`: A single checkbox input, or if `options` are provided, multiple checkboxes.
- `radio`: A set of radio inputs - required an `options` array.
- `decimal`: With Validator, only allows any number, including decimals and negative numbers.
- `number`: Like decimal, but uses the `number` input type, which is often constrained by browsers, may be provided with a spinner.
- `integer`: With Validator, restricted to entering only positive integers.
- `email`: Must be a valid email address.
- `postal`: With Validator, must be a valid Canadian postal code.
- `url`: Must be a valid URL. Will be prepended with `https://` if no protocol is provided.
- `tel`: Must be a valid phone number. With Validator, must be a valid North American phone number.
- `phone`: An alias for tel.
- `date`: Must be a valid date. Validator can limit the date range and reformat to specific format.
- `datetime`: A valid date and time. Validator can limit the date range and reformat to specific format.
- `time`: A valid time.
- `password`: A password input that can be shown or hidden.
- `color`: A color picker input. Shows a color preview and allows the user to select a color. With validator, the color preview will be updated to show the entered color.
- `markdown`: A textarea that has support for the EasyMDE markdown editor. The `EasyMDE` library must be included in the project, and if it is, it will be applied to the textarea.
- `submit`: A submit button.
- `display`: Not actually an input, but a field that displays a value that lines up with the other inputs.

The above inputs may be automatically given appropriate attributes or related fields to improve accessibilty and usability.

- `tel`/`phone`, `email`, `url`, `date`, `datetime`, `time`, `color`, `password` will have a prefix icon (requires fontawesome) to indicate the type of input.
- `decimal`, `number`, `integer`, `email`, `postal`, `url`, `tel`, `phone` will have an `inputmode` attribute to help mobile users.
- Many types will be given a `placeholder` to help users understand what to enter.
- Some types have the `type` attribute set to `input` beacuse the browser's default type does more harm than good. In these cases, the `data-type` attribute will be set to tell Validator how to validate and format the input.
- `aria-labelledby`: The ID of an element that labels the input, defaults to the label element.
- `aria-describedby`: The ID of an element that describes the input, defaults to the error element.

## Attributes

You can pass any attributes you want to the `AppInput` constructor, including `data-*` attributes but the following attributes are specially handled:

- `type`: The type of input to generate. (Default: `input`)
- `name`: The name of the input. A random name will be generated if not provided.
- `id`: The ID of the input. A random ID based on the name will be generated if not provided.
- `class`: Classes to be added to the Tailwind classes generated by AppInput
- `label`: The text of the label.
- `value`: The initial value of the input.
- `checked`: Set to true to check a checkbox or radio input.
- `error`: The error message to display if the input is invalid.
- `description`: A longer description of the input, typically displayed below the input.
- `required`: Set to true to make the input required. Uses HTML validation but if Validator is installed, it will handle enforcing this.
- `maxLength`: The maximum number of characters allowed in the input.
- `placeholder`: Placeholder text for the input. Also sets the `data-placeholder` attribute.
- `pattern`: A regular expression pattern to validate the input.
- `prefix`: Text or HTML to be prepended to the input.
- `suffix`: Text or HTML to be appended to the input.
- `classDefault`: Set to override the default class for the input.
- `errorClass`: Classes to add to the default error class for the error element.
- `inputmode`: The inputmode attribute for mobile users. Usually automatically set based on the type.
- `data-type`: Used by Validator to determine how to validate and format the input. Some input types are converted to `input` type with the `data-type` attribute set for Validator to allow the most flexibility in validation and formatting.
- `data-fp-options`: Options for the flatpickr date picker. (Requires flatpickr)
- `data-markdown`: Set to true to enable markdown support in a textarea. Automatically set to true if using `markdown` type. (Requires EasyMDE)
- `emptyOption`: Set to false to prevent an empty option from being added to a select input.
- `options`: Array of options for select, radio, or checkbox inputs. Each option can be a string or an object with `value` and `label` properties.
- `horizontal`: Set to true to make all options in a radio or checkbox input appear on the same line.
- `noErrorEl`: Set to true to prevent the creation of an error element.

## Constructor and public methods:

- **constructor(attributes: IAttributes & AnyAttributes)**: Initializes a new instance of `AppInput` with the provided attributes.

- `start()`: Returns the start of the input element, including the label and any prefix.
- `end()`: Returns the end of the input element, including any suffix. Using `start` with this can useful for inputs that wrap some content like `textarea` and `select`.

- `getFormItem(className: string = ''): HTMLElement`: Returns a form item DOM element with an outer container containing the input, label, description, error elements, etc. The className argument is a space-separated list of classes to add to the form item.

- `getFormItemHTML(className: string = ''): string`: Returns the HTML of the form item. The className argument is a space-separated list of classes to add to the form item.

- `appendToForm(form: HTMLElement, className: string = '')`: Appends the form item to the provided form element. The className argument is a space-separated list of classes to add to the form item.
