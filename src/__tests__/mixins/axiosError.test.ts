import axios, { AxiosError, AxiosResponse } from 'axios'
import { AxiosErrorMixin } from '../../mixins'
import { Endpoint } from '../../endpoint'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

class TestEndpoint extends AxiosErrorMixin(Endpoint) {}

const response = {
  config: {},
  status: 422,
  statusText: 'Unprocessable Entity',
  headers: {},
  data: {},
}

type TransformInput = (axiosResponse?: Partial<AxiosResponse>) => AxiosError

const noTransform = (input: any): any => input

const makeAxiosError: TransformInput = (axiosResponse?: Partial<AxiosResponse>): AxiosError => {
  const err = new AxiosError()
  if (response) {
    err.response = {
      data: undefined,
      status: 500,
      statusText: 'Testing',
      headers: {},
      config: {},
      ...axiosResponse,
    }
  }
  return err
}

describe(`${AxiosErrorMixin.name}`, (): void => {
  it.each([
    [undefined, noTransform],
    [new Error('foo bar issue'), noTransform],
    [{ data: undefined }, makeAxiosError],
    [{ data: { errors: { key: [] } } }, makeAxiosError],
    [{ ...response, data: { message: 'hello foo bar' } }, makeAxiosError],
    [{ ...response, status: 400, statusText: 'Bad Request' }, makeAxiosError],
  ])(
    'handleError throw AxiosError based on input %p',
    async (error: any, transform: TransformInput): Promise<void> => {
      expect.assertions(1)
      const expectThrow = async (): Promise<never> => new TestEndpoint().handleError(transform(error))
      await expect(expectThrow()).rejects.toMatchSnapshot()
    },
  )
})
