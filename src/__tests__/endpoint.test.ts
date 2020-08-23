import axios, { AxiosRequestConfig } from 'axios'
import * as helper from '../helpers/safeResponseData'
import { Endpoint } from '../index'
import { BasicMock } from './mock/axios'
import qs from 'qs'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

const testConfig: AxiosRequestConfig = { url: '123', method: 'get' }

describe(`${Endpoint.name}`, (): void => {
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
    expect(new Endpoint().requestConfig({ url: 'test/path', method: 'get' })).toMatchInlineSnapshot(`
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
    expect(endpoint.requestConfig(config)).toMatchInlineSnapshot(`
      Object {
        "baseURL": "https://example.com",
        "headers": Object {},
        "method": "PATCH",
        "paramsSerializer": [Function],
        "url": "test/path",
      }
    `)
  })

  it('the request will return response object', async (): Promise<void> => {
    expect.assertions(1)
    const endpoint = new Endpoint()
    expect(await endpoint.request(testConfig)).toStrictEqual({
      config: {},
      data: {
        foo: 'bar',
      },
    })
  })

  it('the request will throw error axios.request throws', async (): Promise<void> => {
    expect.assertions(1)
    const error = new Error('testing')
    const endpoint = new Endpoint()
    const axiosRequest = jest.spyOn(axios, 'request').mockImplementation((): never => {
      throw error
    })
    await expect(endpoint.request(testConfig)).rejects.toBe(error)
    axiosRequest.mockRestore()
  })

  it('static method handleRequestError calls endpoint implementation of handleError', (): void => {
    expect.assertions(1)
    const error = new Error()
    expect((): void => Endpoint.handleRequestError(error, new Endpoint())).toThrow(error)
  })

  it('static method safeResponseData calls safeResponseData helper function', (): void => {
    expect.assertions(2)
    const data = undefined
    const safeResponseData = jest.spyOn(helper, 'safeResponseData').mockReturnValue(data)
    expect(Endpoint.safeResponseData({} as any)).toBe(data)
    expect(safeResponseData).toHaveBeenCalledTimes(1)
    safeResponseData.mockRestore()
  })
})
