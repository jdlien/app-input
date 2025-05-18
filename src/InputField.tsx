'use client'

import React, {
  useId,
  useState,
  ChangeEvent,
  FocusEvent,
  HTMLInputTypeAttribute,
  ReactNode,
} from 'react'
import clsx from 'clsx' // For conditional class names
import {
  IconEnvelope,
  IconMapMarker,
  IconLink,
  IconPhone,
  IconCalendar,
  IconCalendarDay,
  IconClock,
  IconLock,
  IconPalette,
} from './InputIcons'

// --- TYPE DEFINITIONS ---

export type OptionType =
  | string
  | {
      value: string
      label?: string
      description?: string
      selected?: boolean // Note: In React, selection for controlled components is usually handled by the value prop
    }

export type NormalizedOptionType = {
  value: string
  label: string
  description?: string
  selected?: boolean // Retained for data structure, but 'checked' or 'value' prop will manage state
}

interface BaseInputProps {
  // Core HTML attributes
  type?:
    | HTMLInputTypeAttribute
    | 'select'
    | 'textarea'
    | 'decimal'
    | 'integer'
    | 'postal'
    | 'date'
    | 'datetime'
    | 'time'
    | 'markdown'
    | 'display'
    | 'color' // Extended types
  name?: string
  id?: string // Will be auto-generated if not provided
  className?: string // For custom styling of the input wrapper or input itself
  value?: string | number | readonly string[]
  defaultValue?: string | number | readonly string[]
  onChange?: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void
  onBlur?: (
    event: FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  maxLength?: number
  pattern?: string
  autoFocus?: boolean
  // Custom attributes from original class
  label?: ReactNode
  error?: ReactNode
  description?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  'data-pattern'?: string // For validator compatibility
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
  'data-type'?: string // For specific data handling, e.g., 'date', 'integer'
  'data-placeholder'?: string // Original had this for select
  'data-fp-options'?: string // For flatpickr or other JSON options
  'data-markdown'?: boolean
  // Behavior & Layout
  options?: Array<OptionType>
  emptyOption?: boolean | string // For select: true for empty, string for placeholder text
  horizontal?: boolean // For radio/checkbox groups
  noErrorEl?: boolean // To hide the error message element
  fullWidth?: boolean // Hint for layout, might influence wrapper or label
  // Theming - simplified for now, can be expanded
  theme?: 'zinc' | 'stone'
  // Classes for sub-elements (optional overrides)
  labelClassName?: string
  inputClassName?: string // Specifically for the <input>, <select>, <textarea>
  errorClassName?: string
  descriptionClassName?: string
  prefixClassName?: string
  suffixClassName?: string
  // Allow any other data-* attributes
  [key: `data-${string}`]: any
}

// Making all standard HTML input props available, plus our custom ones.
// This can be more precisely typed using Omit and Intersection types if needed.
export type InputFieldProps = BaseInputProps &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    keyof BaseInputProps | 'size'
  > &
  Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    keyof BaseInputProps | 'size'
  > &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseInputProps>

// --- HELPER SUB-COMPONENTS ---
interface InputLabelProps {
  htmlFor: string
  label: ReactNode
  className?: string
  required?: boolean // To add asterisk or other indicators if needed
  fullWidth?: boolean // For layout consistency
}
const InputLabel: React.FC<InputLabelProps> = ({
  htmlFor,
  label,
  className,
  required,
  fullWidth,
}) => {
  if (!label) return null
  return (
    <label
      htmlFor={htmlFor}
      id={`${htmlFor}-label`}
      className={clsx(
        'block text-sm font-medium text-zinc-700 dark:text-zinc-300',
        fullWidth && 'sm:col-span-3', // Example for grid layout
        'sm:mt-px sm:pt-1', // From original AppInput
        className,
      )}
    >
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  )
}

interface InputErrorProps {
  id: string
  error?: ReactNode
  className?: string
}
const InputError: React.FC<InputErrorProps> = ({ id, error, className }) => {
  if (!error) return <div className="min-h-[20px]"></div> // Maintain space like original
  return (
    <div className="min-h-[20px]">
      <p
        id={id}
        className={clsx(
          'text-sm text-red-600 transition dark:text-red-500',
          className,
        )}
      >
        {error}
      </p>
    </div>
  )
}

interface InputDescriptionProps {
  id: string
  description?: ReactNode
  className?: string
}
const InputDescription: React.FC<InputDescriptionProps> = ({
  id,
  description,
  className,
}) => {
  if (!description) return null
  return (
    <p
      id={id}
      className={clsx(
        'mt-1 text-sm text-zinc-500 dark:text-zinc-400',
        className,
      )}
    >
      {description}
    </p>
  )
}

interface InputAffixProps {
  htmlFor?: string // Optional: for associating with the input, e.g., for color picker
  children: ReactNode
  className?: string
  baseColorClass: string // e.g. 'border-zinc-350 dark:border-zinc-500'
  bgColorClass: string // e.g. 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
  isPrefix?: boolean
}
const InputAffix: React.FC<InputAffixProps> = ({
  htmlFor,
  children,
  className,
  baseColorClass,
  bgColorClass,
  isPrefix,
}) => {
  if (!children) return null
  return (
    <label // Using label for clickable area, similar to original
      htmlFor={htmlFor}
      className={clsx(
        'inline-flex min-w-[30px] items-center justify-center border px-1',
        isPrefix ? 'rounded-l-md border-r-0' : 'rounded-r-md border-l-0',
        baseColorClass,
        bgColorClass,
        className,
      )}
    >
      {children}
    </label>
  )
}

// --- UTILITY FUNCTIONS ---

const normalizeOptions = (options?: OptionType[]): NormalizedOptionType[] => {
  if (!options) return []
  return options
    .map((opt) => {
      if (typeof opt === 'string') return { value: opt, label: opt }
      if (opt === undefined || opt.value === undefined) {
        console.warn(
          'Option must have a value. Filtering out undefined/NULL values.',
          opt,
        )
        return null // Will be filtered out
      }
      const value =
        opt.value.length > 1 && opt.value.endsWith(',')
          ? opt.value.replace(/,$/, '')
          : opt.value
      const label =
        'label' in opt && opt.label !== undefined ? opt.label : value
      const normalized: NormalizedOptionType = { value, label }
      if (opt.description !== undefined)
        normalized.description = opt.description
      if (opt.selected !== undefined) normalized.selected = opt.selected // Keep for initial state if needed
      return normalized
    })
    .filter((opt) => opt !== null) as NormalizedOptionType[]
}

// --- MAIN INPUTFIELD COMPONENT ---

const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    // Destructure all props
    type: rawType = 'text',
    name,
    id: propId,
    className,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder: rawPlaceholder,
    disabled,
    required,
    readOnly,
    maxLength,
    pattern: htmlPattern, // renamed to avoid conflict with internal pattern variable
    autoFocus,
    label,
    error,
    description,
    prefix: rawPrefix,
    suffix: rawSuffix,
    inputMode: rawInputMode,
    'data-type': rawDataType,
    'data-placeholder': rawDataPlaceholder,
    'data-fp-options': dataFpOptions,
    'data-markdown': dataMarkdown,
    options: rawOptions,
    emptyOption = true,
    horizontal,
    noErrorEl,
    fullWidth,
    theme = 'zinc', // Default theme
    // Class overrides
    labelClassName,
    inputClassName: baseInputClassName, // Renamed for clarity
    errorClassName,
    descriptionClassName,
    prefixClassName,
    suffixClassName,
    ...restProps // Spread rest for additional HTML attributes
  } = props

  const generatedId = useId()
  const id = propId || generatedId

  // Theme-based colors (simplified)
  const borderColor =
    theme === 'stone'
      ? 'border-stone-300 dark:border-stone-600'
      : 'border-zinc-300 dark:border-zinc-600'
  const bgColor =
    theme === 'stone'
      ? 'bg-stone-50 dark:bg-stone-800'
      : 'bg-zinc-50 dark:bg-zinc-800'
  const placeholderColor =
    theme === 'stone'
      ? 'placeholder-stone-400 dark:placeholder-stone-500'
      : 'placeholder-zinc-400 dark:placeholder-zinc-500'
  const textColor =
    theme === 'stone'
      ? 'text-stone-700 dark:text-stone-200'
      : 'text-zinc-700 dark:text-zinc-200'
  const focusRingColor =
    theme === 'stone' ? 'focus:ring-amber-500' : 'focus:ring-blue-500' // Example variation

  const prefixSuffixBaseColor =
    theme === 'stone'
      ? 'border-stone-350 dark:border-stone-500'
      : 'border-zinc-350 dark:border-zinc-500'
  const prefixSuffixBgColor =
    theme === 'stone'
      ? 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
      : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'

  // Process type and derive related attributes
  let inputType = rawType
  let currentDataType = rawDataType
  let currentInputMode = rawInputMode
  let currentPrefix = rawPrefix
  let currentSuffix = rawSuffix // Added for completeness
  let currentPlaceholder = rawPlaceholder
  let isMarkdown = dataMarkdown

  // Default input classes
  // These are base classes that will be applied. External tailwind.css @apply rules should be migrated here.
  const defaultBaseInputClasses =
    'block w-full px-3 py-1.5 text-base transition duration-150 ease-in-out sm:text-sm sm:leading-5'
  const defaultStyledInputClasses = clsx(
    borderColor,
    bgColor,
    textColor,
    placeholderColor,
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    focusRingColor,
    !disabled &&
      (theme === 'stone'
        ? 'hover:bg-stone-100 dark:hover:bg-stone-700'
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'),
    disabled && 'opacity-50 cursor-not-allowed bg-zinc-100 dark:bg-zinc-700',
  )

  switch (rawType) {
    case 'select':
      currentPlaceholder =
        rawDataPlaceholder ||
        (typeof emptyOption === 'string' ? emptyOption : undefined)
      // Select specific styling (e.g. arrow) will be handled by Tailwind or custom SVG
      break
    case 'textarea':
      // Textarea specific styling if different from text input
      break
    case 'checkbox':
    case 'radio':
      // Checkbox/Radio specific styling. These are often heavily customized.
      // The main inputClassName might not apply directly here or needs careful handling.
      break
    case 'decimal':
      inputType = 'text'
      currentInputMode = currentInputMode ?? 'decimal'
      currentDataType = currentDataType ?? 'decimal'
      break
    case 'integer':
      inputType = 'text'
      currentInputMode = currentInputMode ?? 'numeric'
      currentDataType = currentDataType ?? 'integer'
      break
    case 'email':
      currentInputMode = currentInputMode ?? 'email'
      currentPrefix = currentPrefix ?? <IconEnvelope />
      currentPlaceholder = currentPlaceholder ?? '____@____.___'
      currentDataType = currentDataType ?? 'email'
      break
    case 'postal':
      inputType = 'text'
      currentDataType = currentDataType ?? 'postal'
      currentPrefix = currentPrefix ?? <IconMapMarker />
      currentPlaceholder = currentPlaceholder ?? '___ ___'
      break
    case 'url':
      currentInputMode = currentInputMode ?? 'url'
      currentPrefix = currentPrefix ?? <IconLink />
      currentPlaceholder = currentPlaceholder ?? 'https://____.___'
      break
    case 'tel':
    case 'phone':
      inputType = 'tel'
      currentInputMode = currentInputMode ?? 'tel'
      currentPrefix = currentPrefix ?? <IconPhone />
      currentPlaceholder = currentPlaceholder ?? '___-___-____'
      currentDataType = currentDataType ?? 'tel'
      break
    case 'date':
      inputType = 'text' // Use text for custom styling/picker, or 'date' for native
      currentPrefix = currentPrefix ?? <IconCalendar />
      currentPlaceholder = currentPlaceholder ?? 'YYYY-MM-DD'
      currentDataType = currentDataType ?? 'date'
      break
    case 'datetime':
      inputType = 'text'
      currentPrefix = currentPrefix ?? <IconCalendarDay />
      currentPlaceholder = currentPlaceholder ?? 'YYYY-MM-DD HH:MM'
      currentDataType = currentDataType ?? 'datetime'
      break
    case 'time':
      inputType = 'text'
      currentPrefix = currentPrefix ?? <IconClock />
      currentPlaceholder = currentPlaceholder ?? 'HH:MM'
      currentDataType = currentDataType ?? 'time'
      break
    case 'password':
      currentPrefix = currentPrefix ?? <IconLock />
      break
    case 'color':
      // For 'color' type, original had a complex setup with a text input and a color input.
      // This would be a good candidate for a more specialized sub-component if that UI is desired.
      // For now, treating as text with a palette icon. A native type="color" could also be used.
      inputType = 'text'
      currentPrefix = currentPrefix ?? <IconPalette />
      currentDataType = currentDataType ?? 'color'
      break
    case 'markdown':
      isMarkdown = true
      inputType = 'textarea'
      break
    case 'submit':
      // Submit buttons are usually handled differently, often as <button type="submit">
      // Keeping for consistency but recommend using a Button component.
      // inputClassName here would style it like a button.
      break
    case 'display':
      // Display-only, non-interactive.
      break
  }

  const normalizedOptions = normalizeOptions(rawOptions)

  // ARIA attributes
  const ariaDescribedBy: string[] = []
  if (description) ariaDescribedBy.push(`${id}-description`)
  if (error && !noErrorEl) ariaDescribedBy.push(`${id}-error`)

  const inputSpecificProps: any = {
    id,
    name,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder: currentPlaceholder,
    disabled,
    required,
    readOnly,
    maxLength,
    pattern: htmlPattern,
    autoFocus,
    inputMode: currentInputMode,
    'data-type': currentDataType,
    'data-fp-options': dataFpOptions,
    'data-markdown': isMarkdown,
    'aria-invalid': error ? true : undefined,
    'aria-describedby':
      ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined,
    'aria-labelledby': label ? `${id}-label` : undefined,
    ...restProps, // Spread any remaining valid HTML attributes
  }

  // Remove undefined value/defaultValue to avoid React warnings for uncontrolled/controlled state
  if (inputSpecificProps.value === undefined) delete inputSpecificProps.value
  if (inputSpecificProps.defaultValue === undefined)
    delete inputSpecificProps.defaultValue

  const renderInput = () => {
    const commonInputClasses = clsx(
      defaultBaseInputClasses,
      rawType !== 'checkbox' &&
        rawType !== 'radio' &&
        rawType !== 'submit' &&
        rawType !== 'display' &&
        defaultStyledInputClasses,
      // No rounded corners if there's a prefix or suffix
      currentPrefix && !currentSuffix && 'rounded-l-none',
      currentSuffix && !currentPrefix && 'rounded-r-none',
      !currentPrefix && !currentSuffix && 'rounded-md', // Default rounded if no affixes
      currentPrefix && currentSuffix && 'rounded-none', // No rounding if both
      baseInputClassName, // User-provided specific input classes
    )

    if (rawType === 'select') {
      return (
        <select
          {...inputSpecificProps}
          className={clsx(commonInputClasses, 'pr-10')}
        >
          {emptyOption && (
            <option value="">
              {typeof emptyOption === 'string' ? emptyOption : ''}
            </option>
          )}
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {' '}
              {/* selected is handled by value prop on select */}
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    if (rawType === 'textarea') {
      return (
        <textarea
          {...inputSpecificProps}
          rows={inputSpecificProps.rows || 3}
          className={commonInputClasses}
        />
      )
    }

    if (rawType === 'checkbox' || rawType === 'radio') {
      if (normalizedOptions.length > 0) {
        // Group of radio/checkboxes
        return (
          <div
            className={clsx(
              'space-y-2',
              horizontal && 'flex flex-wrap items-center space-x-4 space-y-0',
            )}
          >
            {normalizedOptions.map((opt, index) => {
              const optionId = `${id}-${index}-${String(opt.value).replace(/[^\da-z]/gi, '')}`
              return (
                <div
                  key={optionId}
                  className={clsx('flex items-start', horizontal && 'py-1')}
                >
                  <div className="flex h-5 items-center">
                    <input
                      {...inputSpecificProps}
                      id={optionId}
                      type={inputType as HTMLInputTypeAttribute} // Cast because it's definitely checkbox/radio here
                      value={opt.value}
                      // For controlled radio groups, 'name' is key and 'checked' determines selection.
                      // For controlled checkbox groups, each needs its own state or logic to determine 'checked'.
                      // This example assumes `value` prop on main component might be an array for multi-checkbox or single for radio.
                      checked={
                        rawType === 'radio'
                          ? value === opt.value
                          : Array.isArray(value)
                            ? value.includes(opt.value)
                            : value === opt.value
                      }
                      className={clsx(
                        'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500',
                        // Add custom styling for radio/checkbox here from tailwind.css
                        baseInputClassName,
                      )}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={optionId}
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      {opt.label}
                    </label>
                    {opt.description && (
                      <p className="text-gray-500 dark:text-gray-400">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      } else {
        // Single checkbox
        return (
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                {...inputSpecificProps}
                type={inputType as HTMLInputTypeAttribute}
                // For single checkbox, `checked` prop on <InputField checked={...} /> would control it.
                // Or if `value` is used, it's often compared against a target value or simply boolean.
                // Defaulting to `!!value` for a common single checkbox scenario.
                checked={inputSpecificProps.checked ?? !!value}
                className={clsx(
                  'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500',
                  // Add custom styling for checkbox here
                  baseInputClassName,
                )}
              />
            </div>
            {label && ( // For single checkbox, label is often to the right
              <div className="ml-3 text-sm">
                <InputLabel
                  htmlFor={id}
                  label={label}
                  className={labelClassName}
                  required={required}
                />
              </div>
            )}
          </div>
        )
      }
    }

    if (rawType === 'display') {
      return (
        <span
          id={id}
          className={clsx('block w-full sm:mt-px sm:pt-1', baseInputClassName)}
          {...restProps}
        >
          {value}
        </span>
      )
    }

    if (rawType === 'submit') {
      // Or button
      return (
        <button
          type="submit"
          id={id}
          name={name}
          disabled={disabled}
          onClick={(e) => onChange && onChange(e as any)} // Simplification, button onClick is different
          className={clsx(
            'btn-primary block w-full text-lg', // from original
            // Add more button specific styles
            baseInputClassName,
          )}
          {...restProps}
        >
          {value || 'Submit'}
        </button>
      )
    }

    // Standard input types (text, email, password, number, etc.)
    return (
      <input
        type={inputType as HTMLInputTypeAttribute} // inputType is now correctly narrowed
        {...inputSpecificProps}
        className={commonInputClasses}
      />
    )
  }

  // For single checkbox, label is handled inside renderInput if not grouped.
  const showOuterLabel =
    label &&
    !(
      (rawType === 'checkbox' || rawType === 'radio') &&
      normalizedOptions.length === 0
    )

  return (
    <div className={clsx('form-item', className)}>
      {' '}
      {/* Main wrapper class */}
      {showOuterLabel && (
        <InputLabel
          htmlFor={id}
          label={label}
          className={labelClassName}
          required={required}
          fullWidth={fullWidth}
        />
      )}
      <div
        className={clsx(
          'mt-1 sm:mt-0', // From original
          fullWidth ? 'sm:col-span-3' : 'sm:col-span-2', // Example grid layout
        )}
      >
        {(rawType === 'checkbox' || rawType === 'radio') &&
        normalizedOptions.length === 0 ? (
          // Single checkbox/radio has label rendered differently, often alongside or error/desc below
          <>
            {renderInput()}
            {!noErrorEl && (
              <InputError
                id={`${id}-error`}
                error={error}
                className={errorClassName}
              />
            )}
            <InputDescription
              id={`${id}-description`}
              description={description}
              className={descriptionClassName}
            />
          </>
        ) : (
          <div
            className={clsx(
              'relative flex rounded-md shadow-sm',
              (rawType === 'checkbox' || rawType === 'radio') && 'flex-col',
            )}
          >
            {currentPrefix && (
              <InputAffix
                isPrefix
                baseColorClass={prefixSuffixBaseColor}
                bgColorClass={prefixSuffixBgColor}
                className={prefixClassName}
              >
                {currentPrefix}
              </InputAffix>
            )}
            {renderInput()}
            {/* Special handling for color picker, if we revive that UI from original */}
            {rawType === 'color' &&
              false /* Disabled for now, placeholder for original color picker logic */ && (
                <label
                  htmlFor={`${id}-colorpicker`}
                  className={clsx(
                    'min-w-[30px] cursor-pointer border border-l-0',
                    borderColor,
                  )}
                  style={{
                    backgroundColor:
                      typeof value === 'string' ? value : '#888888',
                  }}
                >
                  <input
                    type="color"
                    id={`${id}-colorpicker`}
                    className="invisible h-full w-full"
                    value={typeof value === 'string' ? value : '#888888'}
                    onChange={onChange}
                  />
                </label>
              )}
            {currentSuffix && (
              <InputAffix
                isPrefix={false}
                baseColorClass={prefixSuffixBaseColor}
                bgColorClass={prefixSuffixBgColor}
                className={suffixClassName}
                htmlFor={id} // Suffix can also be a label for the input
              >
                {currentSuffix}
              </InputAffix>
            )}
          </div>
        )}
        {/* Error and Description for non-single-checkbox/radio types or grouped ones */}
        {!(
          (rawType === 'checkbox' || rawType === 'radio') &&
          normalizedOptions.length === 0
        ) && (
          <>
            {!noErrorEl && (
              <InputError
                id={`${id}-error`}
                error={error}
                className={errorClassName}
              />
            )}
            <InputDescription
              id={`${id}-description`}
              description={description}
              className={descriptionClassName}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default InputField
