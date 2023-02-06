import qs from 'qs'
import { Endpoint } from '../../endpoint'
import { FormMixin } from '../../mixins'

class TestEndpoint extends FormMixin(Endpoint) {}

const data = { foo: 'bar' }

describe(`${FormMixin.name}`, (): void => {
  it('values are inherited by Endpoint', (): void => {
    expect.assertions(5)
    const endpoint = new TestEndpoint()
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    expect(endpoint.config).toStrictEqual({
      headers,
    })
    expect(endpoint.path).toBe('')
    expect(endpoint.shouldStringify).toBe(true)
    const stringify = jest.spyOn(qs, 'stringify').mockImplementation((): string => 'string')
    expect(endpoint.requestConfig({ url: 'url', method: 'get', data: 'string' })).toMatchInlineSnapshot(`
      Object {
        "baseURL": "http://localhost",
        "data": "string",
        "headers": Object {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        "method": "get",
        "paramsSerializer": Object {
          "serialize": [Function],
        },
        "url": "url",
      }
    `)
    expect(stringify).toHaveBeenCalledTimes(0)
    stringify.mockRestore()
  })

  it('preventStringify set shouldStringify to false', (): void => {
    expect.assertions(2)
    const endpoint = new TestEndpoint()
    expect(endpoint.shouldStringify).toBe(true)
    endpoint.preventStringify()
    expect(endpoint.shouldStringify).toBe(false)
  })

  it('calling preventStringify before requestConfig prevents call to qs.stringify', (): void => {
    expect.assertions(2)
    const endpoint = new TestEndpoint()
    endpoint.preventStringify()
    const stringify = jest.spyOn(qs, 'stringify').mockImplementation((): string => 'string')
    expect(endpoint.requestConfig({ url: 'url', method: 'get', data })).toMatchInlineSnapshot(`
      Object {
        "baseURL": "http://localhost",
        "data": Object {
          "foo": "bar",
        },
        "headers": Object {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        "method": "get",
        "paramsSerializer": Object {
          "serialize": [Function],
        },
        "url": "url",
      }
    `)
    expect(stringify).toHaveBeenCalledTimes(0)
    stringify.mockRestore()
  })

  it('requestConfig calls qs.stringify if data is an object and not FormData', (): void => {
    expect.assertions(2)
    const endpoint = new TestEndpoint()
    const stringify = jest.spyOn(qs, 'stringify').mockImplementation((): string => 'string')
    expect(endpoint.requestConfig({ url: 'url', method: 'get', data })).toMatchInlineSnapshot(`
      Object {
        "baseURL": "http://localhost",
        "data": "string",
        "headers": Object {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        "method": "get",
        "paramsSerializer": Object {
          "serialize": [Function],
        },
        "url": "url",
      }
    `)
    expect(stringify).toHaveBeenCalledTimes(1)
    stringify.mockRestore()
  })
})
