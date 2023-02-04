import '@testing-library/jest-dom'

import App from './App'
import React from 'react'
import { render } from '@testing-library/react'
// import '@types/testing-library__jest-dom'


test('renders learn react link', () => {
    const { getByText } = render(<App />)
    const linkElement = getByText(/learn react/i)
    expect(linkElement).toBeInTheDocument()
})
