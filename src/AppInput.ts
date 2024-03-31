/** Generates a flexible form input compatible with @jdlien/validator */

/** A flexible option that can be passed in */
export type OptionType =
  | string
  | {
      value: string
      label?: string
      description?: string
      selected?: boolean
    }

/** The more strict option that will be used internally */
export type NormalizedOptionType = {
  value: string
  label: string
  description?: string
  selected?: boolean
}

export interface IAttributes {
  type?: string
  name?: string
  id?: string
  class?: string
  label?: string
  value?: string
  checked?: boolean
  error?: string
  description?: string
  required?: true
  maxLength?: number
  placeholder?: string
  pattern?: string
  'data-pattern'?: string
  prefix?: string
  suffix?: string
  classDefault?: string
  errorClass?: string
  inputmode?: string
  'data-type'?: string
  'data-placeholder'?: string
  'data-fp-options'?: string
  'data-markdown'?: boolean
  emptyOption?: boolean
  options?: Array<OptionType>
  horizontal?: boolean
  noErrorEl?: boolean
}

export type AnyAttributes = Record<string, any>

// TODO: Consider extending HTMLElement and returning an element instead of a string.
// Whether this makes sense depends on how we use this class.
export default class AppInput {
  hasEndTag: boolean = false
  id: string = ''
  type: string = 'text'
  name: string = ''
  label: string | null = null
  value: string = ''
  error: string = ''
  options: NormalizedOptionType[]
  required: boolean = false
  fullWidth: boolean = false
  horizontal?: boolean = false
  errorClass: string = ''
  noErrorEl: boolean = false
  emptyOption: boolean = true
  classDefault: string = 'block w-full px-1.5'
  useMarkdown: boolean = false
  attributesString: string = ''

  // Generated values
  labelEl: string = ''
  descriptionEl: string = ''
  prefixEl: string = ''
  suffixEl: string = ''
  errorEl: string = ''
  colorEl: string = ''
  // Start of input tag(s)
  html: string = ''
  // End of tag(s)
  htmlEnd: string = ''

  // Default styling for built-in elements
  borderColor: string = 'border-zinc-350 dark:border-zinc-500'
  borderStone: string = 'border-stone-350 dark:border-stone-500'
  prefixSuffixColor: string =
    'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
  prefixSuffixStone: string =
    'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
  labelClassDefault: string = 'block font-medium sm:mt-px sm:pt-1'
  prefixClassDefault: string =
    'px-1 min-w-[30px] border border-r-0 inline-flex items-center justify-center'
  suffixClassDefault: string = 'px-1 border border-l-0'
  errorClassDefault: string =
    'error hidden text-sm text-red-600 transition dark:text-red-500'
  descriptionClassDefault: string =
    'mt-1 text-sm text-zinc-500 dark:text-zinc-400'

  constructor(attributes: IAttributes & AnyAttributes = {}) {
    // If this is www2, use the stone colors instead of zinc
    const isW2 = window.location.hostname.includes('www2')

    if (isW2) {
      this.borderColor = this.borderStone
      this.prefixSuffixColor = this.prefixSuffixStone
    }

    // Set appropriate hue of gray based on the environment
    this.prefixClassDefault +=
      ' ' + this.prefixSuffixColor + ' ' + this.borderColor
    this.suffixClassDefault +=
      ' ' + this.prefixSuffixColor + ' ' + this.borderColor

    // Ensure appropriate values are set for input attributes
    attributes = this.setupInputAttributes(attributes)

    // Set variables needed outside of init()
    this.type = attributes.type as string
    this.hasEndTag = ['select', 'textarea', 'button'].some(
      (el) => el === this.type.toLowerCase(),
    )
    this.required = attributes.required ?? false
    this.horizontal = attributes.horizontal ?? false
    this.id = attributes.id as string
    this.name = attributes.name as string
    this.emptyOption = attributes.emptyOption ?? true
    this.options = this.normalizeOptions(attributes.options ?? [])
    this.value = attributes.value ?? ''
    this.error = attributes.error ?? ''
    // If fullWidth is true, the input will use all the available columns
    this.fullWidth = attributes.fullWidth ?? false
    if (attributes['full-width']) this.fullWidth = attributes['full-width']

    // Set optional elements
    this.labelEl = this.generateLabelEl(attributes)
    this.colorEl = this.generateColorEl(attributes)
    this.errorEl = this.generateErrorEl(attributes)
    this.prefixEl = this.generatePrefixEl(attributes)
    this.suffixEl = this.generateSuffixEl(attributes)
    this.descriptionEl = this.generateDescriptionEl(attributes)

    // Set up the input attributes - must be done after labelEl and errorEl are set
    this.attributesString = this.generateAttributesString(attributes)
  } // end constructor

  /** Returns an ID based on the attributes or generates a random one */
  generateId(attributes: IAttributes): string {
    if (attributes.id) return attributes.id

    // If there's no id, use the name or generate a random one
    if (attributes.name)
      return attributes.name + '-' + Math.random().toString(36).slice(2)

    return 'input-' + Math.random().toString(36).slice(2)
  }

  /** Generates an HTML element string for a specified FontAwesome icon */
  faIcon(iconName: string): string {
    return `<i class="fa fa-${iconName}" aria-hidden="true"></i>`
  }

  setupInputAttributes(attributes: IAttributes): IAttributes {
    attributes.id = this.generateId(attributes)

    if (!attributes.name) attributes.name = attributes.id

    // If there's a pattern attribute, also add a data-pattern attribute (to appease the TS in Validator)
    if (attributes?.pattern) attributes['data-pattern'] = attributes.pattern

    attributes.type = attributes.type?.toLowerCase() ?? 'text'

    // Adjust default settings based on type
    switch (attributes.type) {
      case 'select':
        attributes.classDefault ??= 'block w-full'
        if (attributes.placeholder)
          attributes['data-placeholder'] = attributes.placeholder
        break

      case 'textarea':
        attributes.classDefault ??= 'block w-full border'
        break

      case 'checkbox':
        attributes.classDefault ??= ''
        break

      case 'radio':
        attributes.classDefault ??= ''
        break

      case 'decimal':
        attributes.type = 'text'
      case 'number':
        attributes.inputmode ??= 'decimal' // Numeric keyboard on mobile
        attributes['data-type'] ??= 'decimal'
        break

      case 'integer':
        attributes.type = 'text'
        attributes.inputmode ??= 'numeric' // Numeric keyboard on mobile
        attributes['data-type'] ??= 'integer'
        break

      case 'email':
        attributes.inputmode ??= 'email'
        attributes.prefix ??= this.faIcon('envelope')
        attributes.placeholder ??= '____@____.___'
        attributes['data-type'] ??= 'email'
        break

      case 'postal':
        attributes.type = 'text'
        attributes['data-type'] = 'postal'
        attributes.prefix ??= this.faIcon('map-marker-alt')
        attributes.placeholder ??= '___ ___'
        break

      case 'url':
        attributes.inputmode ??= 'url'
        attributes.prefix ??= this.faIcon('link')
        attributes.placeholder ??= 'https://____.___'
        break

      case 'tel':
      case 'phone':
        attributes.inputmode ??= 'tel'
        attributes.type ??= 'tel'
        attributes.prefix ??= this.faIcon('phone')
        attributes.placeholder ??= '___-___-____'
        attributes['data-type'] ??= 'tel'
        break

      case 'date':
        attributes.prefix ??= this.faIcon('calendar-alt')
        attributes.placeholder ??= 'YYYY-Mmm-D'
        // Override built-in date validation
        attributes['data-type'] = 'date'
        attributes.type = 'text'
        break

      case 'datetime':
        attributes.prefix ??= this.faIcon('calendar-day')
        attributes.placeholder ??= 'YYYY-Mmm-D h:mm AM'
        attributes['data-type'] = 'datetime'
        attributes.type = 'text'
        break

      case 'time':
        attributes.prefix ??= this.faIcon('clock')
        attributes.placeholder ??= 'H:MM AM'
        attributes['data-type'] = 'time'
        attributes.type = 'text'
        break

      case 'password':
        attributes.prefix ??= this.faIcon('lock')
        break

      case 'color':
        attributes.prefix ??= this.faIcon('palette')
        attributes['data-type'] = 'color'
        attributes.type = 'text'
        break

      case 'markdown':
        this.useMarkdown = true
        attributes['data-markdown'] = true
        attributes.type = 'textarea'
        break

      case 'submit':
        attributes.classDefault ??= 'btn-primary block w-full text-lg'
        break

      case 'display':
        // Used to only display a span and not a form input
        attributes.classDefault ??= 'block w-full sm:mt-px sm:pt-1'
    }

    // If we haven't yet set a default class, set it to the default
    attributes.classDefault ??= 'block w-full px-1.5 transition'

    return attributes
  }

  /**
   * Returns a class attribute string. A default class may be set in the class property variables
   * which can be overridden and combined with additional custom classes for an element.
   * @param elType The type of element (eg label, error, prefix, suffix, description, etc)
   * @param attributes The attributes object used in the constructor or elsewhere.
   * @return A class attribute string. (eg class="classDefault classOther")
   */
  classAttr(elType: string, attributes: IAttributes): string {
    const defaultKey = `${elType}ClassDefault`
    const indexedAttributes: { [key: string]: any } = attributes
    let classDefault =
      defaultKey in indexedAttributes
        ? indexedAttributes[defaultKey]
        : (this as any)[defaultKey] || ''

    // If this is a "fullWidth" input, also make the label full width
    if (elType === 'label' && this.fullWidth) classDefault += ' sm:col-span-3'

    const customClass = indexedAttributes[`${elType}Class`] || ''
    return `class="${classDefault.trim()} ${customClass.trim()}"`
  }

  generateLabelEl(attributes: IAttributes): string {
    if (attributes.label === undefined || attributes.label === null) return ''

    // If label is 'true', assume it should be treated as boolean and remove.
    if (attributes.label === 'true') attributes.label = ''

    const classAttribute = this.classAttr('label', attributes)
    return /*html*/ `<label
    for="${attributes.id}"
    id="${attributes.id}-label"
    ${classAttribute}>${attributes.label}</label>`
  }

  generateColorEl(attributes: IAttributes): string {
    if (attributes['data-type'] !== 'color') return ''

    const pickColor = attributes.value ? attributes.value : '#888888'

    return /*html*/ `
      <label id="${attributes.id}-color-label"
        for="${attributes.id}-color"
        class="min-w-[30px] border border-l-0 ${this.borderColor} cursor-pointer"
        style="background-color: ${pickColor}"
      >
        <input type="color"
          id="${attributes.id}-color"
          class="invisible w-full h-full"
          value="${pickColor}"
        />
      </label>
    `
  }

  generateErrorEl(attributes: IAttributes): string {
    if (attributes.noErrorEl) return ''

    const classAttribute = this.classAttr('error', attributes)
    return /*html*/ `<div class="min-h-[20px]"><div ${classAttribute} id="${attributes.id}-error"></div></div>`
  }

  generatePrefixEl(attributes: IAttributes): string {
    if (!attributes.prefix) return ''

    let prefixFor = attributes.id || ''

    if (this.colorEl) prefixFor += '-color'

    const classAttribute = this.classAttr('prefix', attributes)
    return /*html*/ `<label for="${prefixFor}" ${classAttribute}>${attributes.prefix}</label>`
  }

  generateSuffixEl(attributes: IAttributes): string {
    if (!attributes.suffix) return ''

    const classAttribute = this.classAttr('suffix', attributes)
    return /*html*/ `<label for="${attributes.id}" id="${attributes.id}-suffix" ${classAttribute}>${attributes.suffix}</label>`
  }

  generateDescriptionEl(attributes: IAttributes): string {
    if (!attributes.description) return ''

    const classAttribute = this.classAttr('description', attributes)
    return /*html*/ `<p ${classAttribute}>${attributes.description}</p>`
  }

  generateAttributesString(attributes: IAttributes): string {
    // Merge classDefault and provided class
    const classAttr =
      (attributes.classDefault ? attributes.classDefault + ' ' : '') +
      (attributes.class ? attributes.class : '')

    const distinctClasses = Array.from(new Set(classAttr.split(' '))).join(' ')

    // Create a string of all the attributes to be added to the HTML
    let attributesString = `class="${distinctClasses}"`

    // Add type for tags other than select and textarea that do not require end tag
    if (!['select', 'textarea', 'display'].includes(attributes.type || '')) {
      attributesString += ` type="${attributes.type}"`
    }

    // Special Attributes get handled separately and do not simply get added to the attributes string
    const booleanAttributes = [
      'checked',
      'disabled',
      'readonly',
      'required',
      'multiple',
    ]
    const specialAttributes = booleanAttributes.concat([
      'class',
      'type',
      'error',
      'errorClass',
      'classDefault',
      'labelClassDefault',
      'data-fp-options',
      'options',
      'horizontal',
      'description',
      'label',
      'prefix',
      'value',
    ])

    // Don't add the value attribute or input-specific for display-only elements
    if (this.type === 'display') {
      specialAttributes.push('maxLength', 'name', 'placeholder')
    }

    // Handle adding boolean attributes if they are defined and the value is not falsy
    booleanAttributes.forEach((attr) => {
      if (
        attributes[attr as keyof IAttributes] !== false &&
        typeof attributes[attr as keyof IAttributes] !== 'undefined'
      )
        attributesString += ` ${attr}`
    })

    // Build the string with HTML attributes that we don't specially handle here
    for (const attr in attributes) {
      if (specialAttributes.includes(attr)) continue
      attributesString += ` ${attr.toLowerCase()}="${attributes[attr as keyof IAttributes]}"`
    }

    // Add the error attribute to the input so we can use it later
    attributesString += ` data-error-default="${attributes.error || ''}"`

    // Any strings containing JSON must be escaped
    if (attributes['data-fp-options']) {
      attributesString += ` data-fp-options='${attributes['data-fp-options']}'`
    }

    // If there's a maxLength attribute, add a data-maxlength attribute
    if (attributes.maxLength)
      attributesString += ` data-max-length="${attributes.maxLength}"`

    // Add ARIA attributes. aria-required not needed as we use the required attribute
    if (this.labelEl) attributesString += ` aria-labelledby="${this.id}-label"`
    if (this.errorEl) attributesString += ` aria-describedby="${this.id}-error"`

    if (!this.hasEndTag && attributes.value !== undefined) {
      const escapedValue = String(attributes.value)
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      attributesString += ` value="${escapedValue}"`
    }

    return attributesString
  } // end generateAttributesString()

  /** Accepts options in a variety of formats and returns a normalized array of value/label option objects */
  normalizeOptions(options: OptionType[]): NormalizedOptionType[] {
    return options.map((opt: any) => {
      // Convert simple values to objects
      // Assuming that isSimpleValue is a function that you have defined to detect simple values
      if (typeof opt === 'string') return { value: opt, label: opt }

      // Check for undefined before accessing properties
      if (opt === undefined || opt.value === undefined) {
        throw new Error(
          'Option must have a value. Remove undefined/NULL values.',
        )
      }

      // Remove any trailing commas from values
      const value =
        opt.value.length > 1 ? opt.value.replace(/,$/, '') : opt.value

      // Ensure any option with a value also has a label, if it doesn't already
      const label = 'label' in opt ? opt.label : value

      // Create the normalized option
      const normalizedOption: NormalizedOptionType = { value, label }

      // Add description and selected properties if they exist
      if (opt.description !== undefined)
        normalizedOption.description = opt.description
      if (opt.selected !== undefined) normalizedOption.selected = opt.selected

      return normalizedOption
    })
  }

  generateOptions(options: NormalizedOptionType[]): string {
    // Create the input group for all the options
    // Open the group div
    const divClasses = this.horizontal
      ? 'shadow-inner rounded-2xl bg-zinc-300/10 flex flex-wrap items-center space-x-0.5'
      : 'mb-3 space-y-3'
    const optClasses = this.horizontal ? 'p-0.5' : 'py-1'
    let html = /*html*/ `<div class="sm:col-span-2 ${divClasses}">`

    // Loop through options
    let i = 1
    for (let option of options as NormalizedOptionType[]) {
      // Create a unique ID for the input. This presumes the values are unique.
      const optionId = `${this.id}-${i++}-${String(option.value).replace(/[^\da-z]/gi, '')}`
      html += /*html*/ `<div class="${optClasses}">`

      // Create the input. We use type coercion so the value can be a number or boolean.
      html += /*html*/ `<div class="flex ${this.horizontal ? 'items-center' : 'items-start'}">`
      html += /*html*/ `
        <label
          class="checked-border ${this.type === 'radio' ? 'rounded-full' : ''}"
          for="${optionId}">
            <input
              id="${optionId}"
              ${this.required ? 'required' : ''}
              name="${this.name}"
              type="${this.type}"
              value="${option.value}"
              ${this.error ? `data-error-default="${this.error}"` : ''}
              ${this.value == option.value && this.value !== '' ? 'checked' : ''}
              ${option.selected === true ? 'checked' : ''}
              class="block transition"
              ${this.errorEl ? `aria-describedby="${this.id}-error"` : ''}
            />
            <span class="checked-label">${option.label}</span>
          </label>`
      html += `</div>`

      // Extended description, if provided
      if (option.description)
        html += `<div class="mt-2 text-sm">${option.description}</div>`
      // End the radio div
      html += `</div>`
    }

    // End the group div
    html += `</div>`

    return html
  } // end generateOptions()

  start(): string {
    // First handle single checkboxes and radio inputs
    if (
      ['checkbox', 'radio'].includes(this.type) &&
      (!this.options || this.options.length == 0)
    ) {
      let val = this.value ? this.value.toString() : '0'
      if (val.toLowerCase() === 'no') val = '0'
      const checked = val ? 'checked' : ''

      return /*html*/ `${this.labelEl}
      <div class="my-0.5 sm:mt-0 sm:col-span-2 pt-2">
        <div class="flex relative">
          <input ${this.type == 'display' ? 'disabled' : ''} ${this.attributesString} ${checked}/>
        </div>
        ${this.descriptionEl}
        ${this.errorEl}
      </div>`
      // Next handle other inputs with no end tag
    }

    const colSpan = this.fullWidth ? 'sm:col-span-3' : 'sm:col-span-2'

    // Next handle inputs with an end tag (e.g., button, select, textarea)
    if (this.hasEndTag) {
      let inputContent = this.type === 'button' ? this.value : ''

      return /*html*/ `${this.labelEl}
      <div class="mb-0.5 mt-1 sm:mt-0 ${colSpan}">
        <${this.type} ${this.attributesString}>${inputContent}`
    }

    // Inputs with no end tag
    let html = this.labelEl

    html += /*html*/ `<div class="my-0.5 sm:mt-0 ${colSpan}">
        <div class="flex relative">`

    const optionsExist = Array.isArray(this.options) && this.options.length > 0
    const validType = ['select', 'radio', 'checkbox'].includes(this.type)

    if (optionsExist && validType) html += this.generateOptions(this.options)
    else if (this.type === 'display')
      html += `<span ${this.attributesString}>${this.value}</span>`
    else
      html += `${this.prefixEl}<input ${this.attributesString} />${this.colorEl}${this.suffixEl}`

    html += /*html*/ `
      </div>
        ${this.descriptionEl}
        ${this.errorEl}
      </div>`

    return html
  } // end start()

  // Add the end tag
  end(): string {
    if (!this.hasEndTag) return ''

    let html = ''

    if (this.type === 'textarea') {
      const tempTextArea = document.createElement('textarea')
      tempTextArea.textContent = this.value
      html += tempTextArea.innerHTML
    }

    if (this.type === 'select') {
      if (this.emptyOption) html += /*html*/ `<option value=""></option>`
      // Make an array of the values. Generally, this should be a 'simple value', not an array or something,
      // but I should consider the possibility of that it could be in a multiple select or similar.
      const valueArr =
        typeof this.value !== 'undefined' ? String(this.value).split(',') : []
      // Remove any empty values
      const values = valueArr.filter((value) => value !== '')

      this.options.forEach((option) => {
        if (typeof option === 'string')
          option = { value: option, label: option }
        html += /*html*/ `
        <option value="${option.value}"
          ${values.includes(String(option.value)) ? 'selected' : ''}
        >${option.label}</option>`
      })
    }

    html += /*html*/ `</${this.type}>`
    html += /*html*/ `${this.descriptionEl}`
    html += /*html*/ `${this.errorEl}`
    html += /*html*/ `</div><!-- end AppInput type=${this.type} -->`

    return html
  } // end end()

  getFormItem(className: string = 'form-item'): HTMLDivElement {
    let div = document.createElement('div')
    div.className = className
    div.innerHTML = this.start() + this.end()
    return div
  }

  getFormItemHTML(): string {
    return this.getFormItem().outerHTML
  }

  // Method to append the input to a form
  appendToForm(form: HTMLFormElement): void {
    form.appendChild(this.getFormItem())
  }
} // end class
