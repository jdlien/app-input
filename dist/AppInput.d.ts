/** Generates a flexible form input compatible with @jdlien/validator */
/** A flexible option that can be passed in */
export type OptionType = string | {
    value: string;
    label?: string;
    description?: string;
    selected?: boolean;
};
/** The more strict option that will be used internally */
export type NormalizedOptionType = {
    value: string;
    label: string;
    description?: string;
    selected?: boolean;
};
export interface IAttributes {
    type?: string;
    name?: string;
    id?: string;
    class?: string;
    label?: string;
    value?: string;
    checked?: boolean;
    error?: string;
    description?: string;
    required?: true;
    maxLength?: number;
    placeholder?: string;
    pattern?: string;
    'data-pattern'?: string;
    prefix?: string;
    suffix?: string;
    classDefault?: string;
    errorClass?: string;
    inputmode?: string;
    'data-type'?: string;
    'data-placeholder'?: string;
    'data-fp-options'?: string;
    'data-markdown'?: boolean;
    emptyOption?: boolean;
    options?: Array<OptionType>;
    horizontal?: boolean;
    noErrorEl?: boolean;
}
export type AnyAttributes = Record<string, any>;
export default class AppInput {
    hasEndTag: boolean;
    id: string;
    type: string;
    name: string;
    label: string | null;
    value: string;
    error: string;
    options: NormalizedOptionType[];
    required: boolean;
    fullWidth: boolean;
    horizontal?: boolean;
    errorClass: string;
    noErrorEl: boolean;
    emptyOption: boolean;
    classDefault: string;
    useMarkdown: boolean;
    attributesString: string;
    labelEl: string;
    descriptionEl: string;
    prefixEl: string;
    suffixEl: string;
    errorEl: string;
    colorEl: string;
    html: string;
    htmlEnd: string;
    borderColor: string;
    borderStone: string;
    prefixSuffixColor: string;
    prefixSuffixStone: string;
    labelClassDefault: string;
    prefixClassDefault: string;
    suffixClassDefault: string;
    errorClassDefault: string;
    descriptionClassDefault: string;
    constructor(attributes?: IAttributes & AnyAttributes);
    /** Returns an ID based on the attributes or generates a random one */
    generateId(attributes: IAttributes): string;
    /** Generates an HTML element string for a specified FontAwesome icon */
    faIcon(iconName: string): string;
    setupInputAttributes(attributes: IAttributes): IAttributes;
    /**
     * Returns a class attribute string. A default class may be set in the class property variables
     * which can be overridden and combined with additional custom classes for an element.
     * @param elType The type of element (eg label, error, prefix, suffix, description, etc)
     * @param attributes The attributes object used in the constructor or elsewhere.
     * @return A class attribute string. (eg class="classDefault classOther")
     */
    classAttr(elType: string, attributes: IAttributes): string;
    generateLabelEl(attributes: IAttributes): string;
    generateColorEl(attributes: IAttributes): string;
    generateErrorEl(attributes: IAttributes): string;
    generatePrefixEl(attributes: IAttributes): string;
    generateSuffixEl(attributes: IAttributes): string;
    generateDescriptionEl(attributes: IAttributes): string;
    generateAttributesString(attributes: IAttributes): string;
    /** Accepts options in a variety of formats and returns a normalized array of value/label option objects */
    normalizeOptions(options: OptionType[]): NormalizedOptionType[];
    generateOptions(options: NormalizedOptionType[]): string;
    start(): string;
    end(): string;
    getFormItem(): HTMLDivElement;
    getFormItemHTML(): string;
    appendToForm(form: HTMLFormElement): void;
}
