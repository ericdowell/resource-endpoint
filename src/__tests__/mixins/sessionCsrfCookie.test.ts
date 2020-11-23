import axios from 'axios'
import { SessionCsrfCookieMixin } from '../../mixins'
import { Endpoint } from '../../endpoint'
import { BasicMock, mockResponse } from '../mock/axios'

const axiosRequest = jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

class TestEndpoint extends SessionCsrfCookieMixin(Endpoint) {}

describe(`${SessionCsrfCookieMixin.name}`, (): void => {
  it('allows normal response to return', async (): Promise<void> => {
    expect.assertions(2)
    expect(await new TestEndpoint().request({ url: 'foo', method: 'put' })).toBe(mockResponse)
    expect(axiosRequest).toHaveBeenCalledTimes(1)
  })

  it('isCsrfTokenMismatch returns true when status is 409 and message is correct', (): void => {
    expect.assertions(1)
    const response = { status: 419, data: { message: 'CSRF token mismatch.' } }
    expect(new TestEndpoint().isCsrfTokenMismatch(response as any)).toBe(true)
  })

  it('requestCsrfCookie calls axios.get', async (): Promise<void> => {
    expect.assertions(2)
    const axiosGet = jest.spyOn(axios, 'get').mockImplementation(async (): Promise<any> => ({}))
    await new TestEndpoint().requestCsrfCookie()
    expect(axiosGet).toHaveBeenCalledTimes(1)
    expect(axiosGet.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "sanctum/csrf-cookie",
        Object {
          "baseURL": "http://localhost",
        },
      ]
    `)
  })

  it('isCsrfTokenMismatch returns true requestCsrfCookie is called successfully', async (): Promise<void> => {
    expect.assertions(4)
    const instance = new TestEndpoint()
    const isCsrfTokenMismatch = jest
      .spyOn(instance, 'isCsrfTokenMismatch')
      .mockImplementation((): boolean => true)
    const requestCsrfCookie = jest
      .spyOn(instance, 'requestCsrfCookie')
      .mockImplementation(async (): Promise<any> => ({}))

    expect(await instance.request({ url: 'foo', method: 'put' })).toBe(mockResponse)
    expect(axiosRequest).toHaveBeenCalledTimes(2)
    expect(isCsrfTokenMismatch).toHaveBeenCalledTimes(1)
    expect(requestCsrfCookie).toHaveBeenCalledTimes(1)
  })

  it('isCsrfTokenMismatch is true and requestCsrfCookie throw retry does not happen', async (): Promise<void> => {
    expect.assertions(4)
    const instance = new TestEndpoint()
    const isCsrfTokenMismatch = jest
      .spyOn(instance, 'isCsrfTokenMismatch')
      .mockImplementation((): boolean => true)
    const requestCsrfCookie = jest.spyOn(instance, 'requestCsrfCookie').mockImplementation(
      async (): Promise<never> => {
        throw new Error()
      },
    )

    expect(await instance.request({ url: 'foo', method: 'put' })).toBe(mockResponse)
    expect(axiosRequest).toHaveBeenCalledTimes(1)
    expect(isCsrfTokenMismatch).toHaveBeenCalledTimes(1)
    expect(requestCsrfCookie).toHaveBeenCalledTimes(1)
  })
})
