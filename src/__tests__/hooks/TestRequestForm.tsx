import React from 'react'
import { RequestForm, RequestFormProps } from '../../components'
import { useFormChange } from '../../hooks'

interface FormState {
  _token: string
  contact: string
  email: string
  remember: boolean
  state: string
  username: string
}

function Username(props: any): React.ReactElement {
  return (
    <input type="text" name="username" onChange={props.onChange} value={props.value} data-testid="username" />
  )
}
Username.displayName = 'Username'

function Email(props: any): React.ReactElement {
  return <input type="email" name="email" onChange={props.onChange} value={props.value} data-testid="email" />
}
Email.displayName = 'Email'

function Contact(props: any): React.ReactElement {
  return (
    <React.Fragment>
      {Object.entries({ phone: 'Phone', email: 'Email', mail: 'Mail' }).map(([value, display], key) => (
        <React.Fragment key={key}>
          <input
            type="radio"
            name="contact"
            checked={props.value === value}
            onChange={props.onChange}
            value={value}
            data-testid={`contact-${value}`}
          />
          {display}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
Contact.displayName = 'Contact'

function SelectState(props: any): React.ReactElement {
  return (
    <select name="state" defaultValue="MN" data-testid="state" onChange={props.onChange}>
      {Object.entries({ WI: 'Wisconsin', MN: 'Minnesota', IL: 'Illinois' }).map(([value, display], key) => (
        <option key={key} value={value}>
          {display}
        </option>
      ))}
    </select>
  )
}
SelectState.displayName = 'SelectState'

function RememberMe(props: any): React.ReactElement {
  return (
    <input
      type="checkbox"
      name="remember"
      onChange={props.onChange}
      data-testid="remember"
      checked={!!props.checked}
    />
  )
}
RememberMe.displayName = 'RememberMe'

function Token(props: any): React.ReactElement {
  return <input type="hidden" name="_token" onChange={props.onChange} value={props.value} />
}
Token.displayName = 'Token'

export function TestRequestForm(
  props: Pick<RequestFormProps, 'children' | 'makeRequest'>,
): React.ReactElement<RequestFormProps> {
  const [onChange, values, setValues] = useFormChange<FormState>({
    _token: 'asdfa;lvwpoeinvdsafkasldfas',
    contact: 'email',
    email: 'email@example.com',
    remember: false,
    state: 'MN',
    username: 'Dr. FooBar',
  })
  return (
    <RequestForm makeRequest={props.makeRequest} values={values} setValues={setValues}>
      {props.children}
      {/* TODO: Fix odd warning uncontrolled/controlled BS for first input. Something with timing is what I'm thinking */}
      <Token onChange={onChange} value={values._token} />
      <Email onChange={onChange} value={values.email} />
      <Username onChange={onChange} value={values.username} />
      <Contact onChange={onChange} value={values.contact} />
      <SelectState onChange={onChange} />
      <RememberMe onChange={onChange} checked={values.remember} />
      <input type="submit" value="Submit" data-testid="submit" />
    </RequestForm>
  )
}
TestRequestForm.displayName = 'TestRequestForm'
