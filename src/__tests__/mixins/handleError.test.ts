import { HandleErrorMixin } from '../../mixins'
import { Endpoint } from '../../endpoint'
import axios from 'axios'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

class TestEndpoint extends HandleErrorMixin(Endpoint) {}

describe('HandleErrorMixin', (): void => {
  it.each([
    [{ response: { data: { errors: { key: [] } } } }, { data: { errors: { key: [] } } }],
    [undefined, {
      data: {
        errors: {
          fallback: 'An unexpected error has occurred. Please try again.',
        },
      },
    }],
  ])('handleError returns data key with errors', async(error, expected): Promise<void> => {
    const endpoint = new TestEndpoint()
    expect(await endpoint.handleError(error)).toStrictEqual(expected)
  })
})
