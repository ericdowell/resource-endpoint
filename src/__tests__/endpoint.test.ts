import axios from 'axios'
import { Endpoint } from '../endpoint'
import { BasicMock } from './mock/axios'

const axiosRequest = jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation(() => {})

describe(Endpoint.name, (): void => {
  beforeEach((): void => {
    axiosRequest.mockClear()
  })

  it('the origin is localhost', () => {
    expect(new Endpoint().origin).toMatchSnapshot()
  })

  it('the path is empty', () => {
    expect(new Endpoint().path).toStrictEqual('')
  })

  it('the endpoint is empty', () => {
    expect(new Endpoint().endpoint).toStrictEqual('')
  })

  it('the getBaseUrl is localhost with trailing slash', () => {
    expect(new Endpoint().getBaseUrl()).toMatchSnapshot()
  })

  it('the headers default is empty', () => {
    expect(new Endpoint().hasHeaders()).toMatchSnapshot()
    expect(new Endpoint().headers).toMatchSnapshot()
  })

  it('the setHeaders updates headers value', () => {
    const endpoint = new Endpoint().setHeader('Accept', 'application/json')
    expect(endpoint.hasHeaders()).toMatchSnapshot()
    expect(endpoint.headers).toMatchSnapshot()
  })

  it('the queryOptions will return default options', () => {
    const options = new Endpoint().queryOptions('final/path', 'get')
    expect(options).toMatchSnapshot()
  })

  it('the responseData will return data key of object', () => {
    const data = new Endpoint().responseData({ data: 'it' })
    expect(data).toMatchSnapshot()
  })

  it('the query will return response object', async(): Promise<void> => {
    await expect(new Endpoint().query('123', 'get')).toMatchSnapshot()
  })
})
