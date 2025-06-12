import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import CsTextField from './index'

const testID = 'csTextField'

describe('csTextField', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChangeText: jest.fn(),
  }

  it('renders correctly with label', () => {
    const { getByText } = render(<CsTextField {...defaultProps} />)
    expect(getByText('Test Label')).toBeTruthy()
  })

  it('handles text input correctly', () => {
    const { getByTestId } = render(<CsTextField {...defaultProps} />)
    const input = getByTestId(`${testID}-input`)
    fireEvent.changeText(input, 'New Value')
    expect(defaultProps.onChangeText).toHaveBeenCalledWith('New Value')
  })

  it('displays error message when provided', () => {
    const { getByText } = render(
      <CsTextField {...defaultProps} error="Error message" />,
    )
    expect(getByText('Error message')).toBeTruthy()
  })

  it('applies disabled style when disabled prop is true', () => {
    const { getByTestId } = render(<CsTextField {...defaultProps} disabled />)
    const input = getByTestId(`${testID}-input`)
    expect(input.props.editable).toBe(false)
  })

  it('toggles password visibility when secureTextEntry is true', () => {
    const { getByTestId } = render(
      <CsTextField {...defaultProps} secureTextEntry />,
    )
    const toggleButton = getByTestId(`${testID}-toggle-password`)
    const input = getByTestId(`${testID}-input`)

    expect(input.props.secureTextEntry).toBe(true)
    fireEvent.press(toggleButton)
    expect(input.props.secureTextEntry).toBe(false)
  })
})
