import axios from 'axios'
import { Endpoint } from '../endpoint'
import { BasicMock } from './mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

describe(Endpoint.name, (): void => {
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

  it('the headers default is empty', () => {
    expect(new Endpoint().hasHeaders()).toBe(false)
    expect(new Endpoint().headers).toStrictEqual({})
  })

  it('the setHeaders updates headers value', () => {
    const endpoint = new Endpoint().setHeader('Accept', 'application/json')
    expect(endpoint.hasHeaders()).toBe(true)
    expect(endpoint.headers).toStrictEqual({
      Accept: 'application/json',
    })
  })

  it('the queryOptions will return default options', () => {
    expect(new Endpoint().queryOptions('final/path', 'get')).toMatchSnapshot()
  })

  it('the responseData will return data key of object', () => {
    const data = 'it'
    expect(new Endpoint().responseData({ data })).toBe(data)
  })

  it('the query will return response object', async(): Promise<void> => {
    await expect(new Endpoint().query('123', 'get')).resolves.toStrictEqual({
      foo: 'bar',
    })
  })
})
