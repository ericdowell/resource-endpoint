import axios from 'axios'
import { Endpoint } from '../index'
import { BasicMock } from './mock/axios'
import qs from 'qs'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

const createEndpoint = (debug = false): Endpoint => {
  const endpoint = new Endpoint()
  return debug ? endpoint.enableDebug() : endpoint
}

describe(Endpoint.name, (): void => {
  it('calling enableDebug will make isDebugEnabled return true', () => {
    const endpoint = new Endpoint()
    expect(endpoint.isDebugEnabled()).toBe(false)
    endpoint.enableDebug()
    expect(endpoint.isDebugEnabled()).toBe(true)
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

  it('the headers default is empty', () => {
    expect(new Endpoint().hasHeaders()).toBe(false)
    expect(new Endpoint().headers).toStrictEqual({})
  })

  it('the setHeaders overrides headers values', () => {
    const endpoint = new Endpoint().setHeaders({ Accept: 'application/json' })
    expect(endpoint.hasHeaders()).toBe(true)
    expect(endpoint.headers).toStrictEqual({
      Accept: 'application/json',
    })
  })

  it('the setHeader updates single headers value', () => {
    const endpoint = new Endpoint().setHeader('Accept', 'application/json')
    expect(endpoint.hasHeaders()).toBe(true)
    expect(endpoint.headers).toStrictEqual({
      Accept: 'application/json',
    })
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
    expect(new Endpoint().requestConfig('final/path', 'get')).toMatchSnapshot()
  })

  it('the requestConfig will return combine headers', () => {
    const endpoint = new Endpoint()
    endpoint.setHeaders({ Accept: 'application/json', 'X-A': 'baz' })
    const config = { headers: { foo: 'bar', Accept: 'text/html' }, paramsSerializer: (): string => '' }
    expect(endpoint.requestConfig('final/path', 'PUT', config)).toMatchSnapshot()
  })

  it('the responseData will return data key of object', () => {
    const data = 'it'
    expect(Endpoint.responseData(undefined)).toBeUndefined()
    expect(Endpoint.responseData({ data })).toBe(data)
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

  it('debugResponse and debugResponseError calls debug', (): void => {
    const endpoint = new Endpoint()
    const debug = jest.spyOn(endpoint, 'debug').mockImplementation((): any => true)
    endpoint.debugResponse('url', 'get', {}, {})
    endpoint.debugResponseError('url', 'get', {}, {})
    expect(debug).toHaveBeenCalledTimes(2)
  })

  it('debug calls this.console', (): void => {
    const endpoint = new Endpoint()
    const log = jest.fn()
    const console = jest.spyOn(endpoint, 'console').mockImplementation((): any => ({ log }))
    expect(endpoint.debug('url', 'get'))
    expect(endpoint.debug('url', 'get', {}, 'label', {}))
    expect(console).toHaveBeenCalled()
  })

  it('static method handleRequestError calls endpoint implementation of handleError', (): void => {
    const error = new Error()
    expect((): void => Endpoint.handleRequestError(error, new Endpoint())).toThrowError(error)
  })
})
