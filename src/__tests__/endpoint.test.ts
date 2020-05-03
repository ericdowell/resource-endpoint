import axios, { AxiosRequestConfig } from 'axios'
import { Endpoint } from '../index'
import { BasicMock } from './mock/axios'
import qs from 'qs'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

const testConfig: AxiosRequestConfig = { url: '123', method: 'get' }

const createEndpoint = (debug = false): Endpoint => {
  const endpoint = new Endpoint()
  return debug ? endpoint.debug() : endpoint
}

describe(`${Endpoint.name}`, (): void => {
  it('calling debug will make shouldDebug return true', () => {
    expect.assertions(2)
    const endpoint = new Endpoint()
    expect(endpoint.shouldDebug()).toBe(false)
    endpoint.debug()
    expect(endpoint.shouldDebug()).toBe(true)
  })

  it('the origin is localhost', () => {
    expect.assertions(1)
    expect(new Endpoint().origin).toBe('http://localhost')
  })

  it('the path is empty', () => {
    expect.assertions(1)
    expect(new Endpoint().path).toBe('')
  })

  it('the endpoint is empty', () => {
    expect.assertions(1)
    expect(new Endpoint().endpoint).toBe('')
  })

  it('the baseURL is localhost', () => {
    expect.assertions(1)
    expect(new Endpoint().baseURL).toBe('http://localhost')
  })

  it('the console returns window.console', (): void => {
    expect.assertions(1)
    expect(new Endpoint().console()).toBe(window.console)
  })

  it('the config.headers default is undefined', () => {
    expect.assertions(1)
    expect(new Endpoint().config.headers).toBeUndefined()
  })

  it('the paramsSerializer will return function that calls qs.stringify', () => {
    expect.assertions(2)
    const stringify = jest.spyOn(qs, 'stringify').mockImplementation((): any => 'foo')
    const paramsSerializer = new Endpoint().paramsSerializer
    expect(stringify).toHaveBeenCalledTimes(0)
    paramsSerializer({})
    expect(stringify).toHaveBeenCalledTimes(1)
    stringify.mockRestore()
  })

  it('the requestConfig will return default config', () => {
    expect.assertions(1)
    expect(new Endpoint().requestConfig({ url: 'test/path', method: 'get' }))
      .toMatchInlineSnapshot(`
      Object {
        "baseURL": "http://localhost",
        "headers": Object {},
        "method": "get",
        "paramsSerializer": [Function],
        "url": "test/path",
      }
    `)
  })

  it('the requestConfig will return passed baseURL and paramsSerializer', () => {
    expect.assertions(1)
    const endpoint = new Endpoint()
    const config: AxiosRequestConfig = {
      baseURL: 'https://example.com',
      method: 'PATCH',
      paramsSerializer: endpoint.paramsSerializer,
      url: 'test/path',
    }
    expect(endpoint.requestConfig(config))
      .toMatchInlineSnapshot(`
      Object {
        "baseURL": "https://example.com",
        "headers": Object {},
        "method": "PATCH",
        "paramsSerializer": [Function],
        "url": "test/path",
      }
    `)
  })

  it.each([[true], [false]])(
    'the request will return response object',
    async (debug): Promise<void> => {
      expect.assertions(2)
      const endpoint = createEndpoint(debug)
      const console = jest.spyOn(endpoint, 'console').mockImplementation((): any => ({
        log: jest.fn(),
      }))
      expect(await endpoint.request(testConfig)).toStrictEqual({
        config: {},
        data: {
          foo: 'bar',
        },
      })
      expect(console).toHaveBeenCalledTimes(debug ? 1 : 0)
    },
  )

  it.each([[true], [false]])(
    'the request will throw error axios.request throws',
    async (debug): Promise<void> => {
      expect.assertions(2)
      const error = new Error('testing')
      const endpoint = createEndpoint(debug)
      const axiosRequest = jest.spyOn(axios, 'request').mockImplementation((): never => {
        throw error
      })
      const console = jest.spyOn(endpoint, 'console').mockImplementation((): any => ({
        log: jest.fn(),
      }))
      await expect(endpoint.request(testConfig)).rejects.toBe(error)
      expect(console).toHaveBeenCalledTimes(debug ? 1 : 0)
      axiosRequest.mockRestore()
    },
  )

  it('logResponse and logResponseError call log method and log calls this.console', (): void => {
    expect.assertions(1)
    const endpoint = new Endpoint().debug()
    const log = jest.fn()
    const console = jest.spyOn(endpoint, 'console').mockImplementation((): any => ({ log }))
    const config: AxiosRequestConfig = { url: 'url', method: 'get' }
    endpoint.logResponse(config, {})
    endpoint.logResponseError(config, {})
    expect(console).toHaveBeenCalledTimes(2)
  })

  it('static method handleRequestError calls endpoint implementation of handleError', (): void => {
    expect.assertions(1)
    const error = new Error()
    expect((): void => Endpoint.handleRequestError(error, new Endpoint())).toThrow(error)
  })

  it.each([
    [{ data: { key: 'value' } }, false, { key: 'value' }],
    [{ data: ['value'] }, true, ['value']],
    [undefined, undefined, {}],
    [undefined, true, []],
  ])('static method safeResponseData returns data property', (response, isArray, expected): void => {
    expect.assertions(1)
    expect(Endpoint.safeResponseData(response as any, isArray)).toStrictEqual(expected)
  })
})
