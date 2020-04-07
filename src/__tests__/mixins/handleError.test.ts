import { HandleErrorMixin } from '../../mixins'
import { Endpoint } from '../../endpoint'
import axios from 'axios'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

class TestEndpoint extends HandleErrorMixin(Endpoint) {}

describe(`${HandleErrorMixin.name}`, (): void => {
  it.each([
    [undefined],
    [{ config: {}, response: { data: undefined } }],
    [{ response: { data: { errors: { key: [] } } } }],
    [{ response: { config: {}, status: 500, statusText: 'foo', headers: {}, data: { message: 'hello foo bar' } } }],
    [{ response: { config: {}, status: 500, statusText: 'foo', headers: {}, data: {} } }],
  ])('handleError returns data key with errors', (error): void => {
    expect.assertions(1)
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(new TestEndpoint().handleError(error)).toMatchSnapshot()
  })

  it('handleError throws when throwResponseError is called first', (): void => {
    expect.assertions(1)
    const message = 'Something went wrong.'
    const error = new Error(message)
    expect((): any => new TestEndpoint().throwResponseError.handleError(error)).toThrow(message)
  })
})
