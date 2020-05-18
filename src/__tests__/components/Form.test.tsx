// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      data-testid="form"
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
    const renderedForm = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <TestForm makeRequest={async (): Promise<any> => ({})}>
        <h1>Title</h1>
      </TestForm>,
    )
    expect(renderedForm.asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
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
      </DocumentFragment>
    `)
  })
})
