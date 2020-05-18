import React from 'react'
import { Form, Props } from '../../components'
import { render, fireEvent, waitForElement } from '@testing-library/react'

function TestForm(
  props: Pick<Props, 'initialState' | 'children' | 'makeRequest' | 'onError' | 'onSuccess'>,
): React.ReactElement<Props> {
  const [values, setValues] = React.useState({
    ...props.initialState,
    foo: 'bar',
  })
  return (
    <Form
      onError={props.onError}
      onSuccess={props.onSuccess}
      makeRequest={props.makeRequest}
      values={values}
      setValues={setValues}
    >
      <input data-testid="foo-input" type="hidden" name="foo" value={values.foo} />
      {props.children}
    </Form>
  )
}

describe('<Form />', (): void => {
  it('renders successfully', async (): Promise<void> => {
    expect.assertions(1)
    const rendered = render(
      <TestForm makeRequest={async (): Promise<any> => ({})}>
        <h1>Title</h1>
      </TestForm>,
    )
    expect(rendered.container).toMatchInlineSnapshot(`
      <div>
        <form>
          <input
            data-testid="foo-input"
            name="foo"
            type="hidden"
            value="bar"
          />
          <h1>
            Title
          </h1>
        </form>
      </div>
    `)
  })
})
