import axios from 'axios'
import { Endpoint } from '../index'
import { BasicMock } from './mock/axios'
import qs from 'qs'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

const createEndpoint = (debug = false): Endpoint => {
  const endpoint = new Endpoint()
  return debug ? endpoint.debug() : endpoint
}

describe(Endpoint.name, (): void => {
  it('calling debug will make shouldDebug return true', () => {
    const endpoint = new Endpoint()
    expect(endpoint.shouldDebug()).toBe(false)
    endpoint.debug()
    expect(endpoint.shouldDebug()).toBe(true)
  })

  it('the origin is localhost', () => {
    expect(new Endpoint().origin).toBe('http://localhost')
  })

  it('the path is empty', () => {
    expect(new Endpoint().path).toBe('')
  })

  it('the endpoint is empty', () => {
    expect(new Endpoint().endpoint).toBe('')
  })

  it('the baseURL is localhost', () => {
    expect(new Endpoint().baseURL).toBe('http://localhost')
  })

  it('the console returns window.console', (): void => {
    expect(new Endpoint().console()).toBe(window.console)
  })

  it('the config.headers default is undefined', () => {
    expect(new Endpoint().config.headers).toBeUndefined()
  })

  it('the paramsSerializer will return function that calls qs.stringify', () => {
    const stringify = jest.spyOn(qs, 'stringify').mockImplementation((): any => 'foo')
    const paramsSerializer = new Endpoint().paramsSerializer
    expect(paramsSerializer).toEqual(expect.any(Function))
    expect(stringify).toBeCalledTimes(0)
    paramsSerializer({})
    expect(stringify).toBeCalledTimes(1)
    stringify.mockRestore()
  })

  it('the requestConfig will return default config', () => {
    expect(new Endpoint().requestConfig('test/path', 'get')).toMatchSnapshot()
  })

  it('the requestConfig will return passed baseURL and paramsSerializer', () => {
    const endpoint = new Endpoint()
    const config = { baseURL: 'https://example.com', paramsSerializer: endpoint.paramsSerializer }
    expect(endpoint.requestConfig('test/path', 'PATCH', config)).toMatchSnapshot()
  })

  it.each([
    [true],
    [false],
  ])('the request will return response object', async(debug): Promise<void> => {
    const endpoint = createEndpoint(debug)
    const debugResponse = jest.spyOn(endpoint, 'debugResponse').mockImplementation((): any => true)
    await expect(endpoint.request('123', 'get')).resolves.toStrictEqual({
      config: {},
      data: {
        foo: 'bar',
      },
    })
    expect(debugResponse).toHaveBeenCalledTimes(debug ? 1 : 0)
  })

  it.each([
    [true],
    [false],
  ])('the request will throw error axios.request throws', async(debug): Promise<void> => {
    const error = new Error('testing')
    const endpoint = createEndpoint(debug)
    const axiosRequest = jest.spyOn(axios, 'request').mockImplementation((): never => {
      throw error
    })
    const debugResponseError = jest.spyOn(endpoint, 'debugResponseError').mockImplementation((): any => true)
    await expect(endpoint.request('123', 'get')).rejects.toBe(error)
    expect(debugResponseError).toHaveBeenCalledTimes(debug ? 1 : 0)
    axiosRequest.mockRestore()
  })

  it('debugResponse and debugResponseError call log method and log calls this.console', (): void => {
    const endpoint = new Endpoint()
    const log = jest.fn()
    const console = jest.spyOn(endpoint, 'console').mockImplementation((): any => ({ log }))
    endpoint.debugResponse('url', 'get', {}, {})
    endpoint.debugResponseError('url', 'get', {}, {})
    expect(console).toHaveBeenCalledTimes(2)
  })

  it('static method handleRequestError calls endpoint implementation of handleError', (): void => {
    const error = new Error()
    expect((): void => Endpoint.handleRequestError(error, new Endpoint())).toThrowError(error)
  })
})
