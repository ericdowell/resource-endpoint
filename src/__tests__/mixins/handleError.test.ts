import { HandleErrorMixin } from '../../mixins'
import { Endpoint } from '../../endpoint'
import axios from 'axios'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

class TestEndpoint extends HandleErrorMixin(Endpoint) {}

const response = { config: {}, status: 422, statusText: 'Unprocessable Entity', headers: {}, data: {} }

describe(`${HandleErrorMixin.name}`, (): void => {
  it.each([
    [undefined],
    [{ config: {}, response: { data: undefined } }],
    [{ response: { data: { errors: { key: [] } } } }],
    [{ response: { ...response, data: { message: 'hello foo bar' } } }],
    [{ response: { ...response, status: 400, statusText: 'Bad Request' } }],
  ])('handleError returns data key with errors', (error: any): void => {
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
