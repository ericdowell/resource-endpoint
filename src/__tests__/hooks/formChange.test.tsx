import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestRequestForm } from './TestRequestForm'

describe('useFormChange', (): void => {
  it('useFormChange onChange correctly updates values', async (): Promise<void> => {
    expect.assertions(2)
    const makeRequest = jest.fn().mockResolvedValue({ data: {} })
    const rendered = render(
      <TestRequestForm makeRequest={makeRequest}>
        <h1>Title</h1>
      </TestRequestForm>,
    )
    await act(
      async (): Promise<void> => {
        const contactPhone = await rendered.findByTestId('contact-phone')
        fireEvent.click(contactPhone)
        const email = await rendered.findByTestId('email')
        await userEvent.clear(email)
        await userEvent.type(email, 'test@example.net')
        const username = await rendered.findByTestId('username')
        await userEvent.clear(username)
        await userEvent.type(username, 'Mr. Dirt')
        const state = await rendered.findByTestId('state')
        fireEvent.change(state, { target: { name: 'state', value: 'IL' } })
        const remember = await rendered.findByTestId('remember')
        fireEvent.click(remember)
        const submit = await rendered.findByTestId('submit')
        fireEvent.click(submit)
      },
    )
    expect(makeRequest).toHaveBeenCalledTimes(1)
    expect(makeRequest.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "_token": "asdfa;lvwpoeinvdsafkasldfas",
          "contact": "phone",
          "email": "test@example.net",
          "remember": true,
          "state": "IL",
          "username": "Mr. Dirt",
        },
      ]
    `)
  })
})
