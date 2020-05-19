import React from 'react'
import { useFormChange } from '../../hooks'
import { RequestFormProps, RequestForm } from '../../components'
import { act, fireEvent, render } from '@testing-library/react'

interface FormState {
  contact: string
  email: string
  remember: boolean
  state: string
  username: string
}

function Username(props: any): React.ReactElement {
  return (
    <input type="text" onChange={props.onChange} value={props.value} name="username" data-testid="username" />
  )
}
Username.displayName = 'Username'

function Email(props: any): React.ReactElement {
  return <input type="email" onChange={props.onChange} value={props.value} name="email" data-testid="email" />
}
Email.displayName = 'Email'

function TestRequestForm(
  props: Pick<RequestFormProps, 'children' | 'makeRequest'>,
): React.ReactElement<RequestFormProps> {
  const [onChange, values, setValues] = useFormChange<FormState>({
    contact: 'email',
    email: 'email@example.com',
    remember: false,
    state: 'MN',
    username: 'Dr FooBar',
  })
  return (
    <RequestForm makeRequest={props.makeRequest} values={values} setValues={setValues}>
      {props.children}
      <Username onChange={onChange} value={values.username} />
      <Email onChange={onChange} value={values.email} />
      {Object.entries({ phone: 'Phone', email: 'Email', mail: 'Mail' }).map(([value, display], key) => (
        <React.Fragment key={key}>
          <input
            key={key}
            type="radio"
            checked={values.contact === value}
            onChange={onChange}
            value={value}
            name="contact"
            data-testid={`contact-${value}`}
          />
          {display}
        </React.Fragment>
      ))}
      <select name="state" defaultValue="MN" data-testid="state" onChange={onChange}>
        {Object.entries({ WI: 'Wisconsin', MN: 'Minnesota', IL: 'Illinois' }).map(([value, display], key) => (
          <option key={key} value={value}>
            {display}
          </option>
        ))}
      </select>
      <input
        type="checkbox"
        onChange={onChange}
        data-testid="remember"
        name="remember"
        checked={values.remember}
      />
      <input type="submit" data-testid="submit" />
    </RequestForm>
  )
}

describe('useFormChange', (): void => {
  it('fireEvent.click(submit) calls default setValues functions', async (): Promise<void> => {
    expect.assertions(2)
    const makeRequest = jest.fn().mockResolvedValue({})
    const rendered = render(
      <TestRequestForm makeRequest={makeRequest}>
        <h1>Title</h1>
      </TestRequestForm>,
    )
    await act(
      async (): Promise<void> => {
        const email = await rendered.findByTestId('email')
        fireEvent.change(email, { target: { name: 'email', value: 'test@example.net' } })
        const username = await rendered.findByTestId('username')
        fireEvent.change(username, { target: { name: 'username', value: 'Mr. Dirt' } })
        const contactPhone = await rendered.findByTestId('contact-phone')
        fireEvent.click(contactPhone)
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
