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
    [{ response: { data: { errors: { key: [] } } } }],
    [undefined],
  ])('handleError returns data key with errors', async(error): Promise<void> => {
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(await new TestEndpoint().handleError(error)).toMatchSnapshot()
  })
})
