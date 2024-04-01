import AppInput from '../src/AppInput'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('AppInput', () => {
  let form: HTMLFormElement

  beforeEach(() => {
    form = document.createElement('form')
    form.id = 'test-form'
    document.body.appendChild(form)
  })

  afterEach(() => {
    document.body.removeChild(form)
  })

  it('should render an input', () => {
    const input = new AppInput({
      type: 'input',
      id: 'test-input',
      name: 'test-input',
      label: 'Test Input',
    })

    const formItem = input.getFormItem()

    form.appendChild(formItem)

    // Get the input element from the formItem element
    const testInput = document.getElementById('test-input') as HTMLInputElement

    // Check that the input element is in the form
    expect(form.querySelector('#test-input')).not.toBe(null)

    expect(testInput.tagName).toBe('INPUT')

    // Check that the input element has the correct type
    expect(testInput.type).toBe('text')

    // Check that the input element has the correct name
    expect(testInput.name).toBe('test-input')

    // Check that the input element has the correct label
    const label = document.getElementById('test-input-label')

    // Expect label to exist
    expect(label).not.toBe(null)

    // Expect label to have the correct text
    expect(label?.textContent).toBe('Test Input')
  })
})
