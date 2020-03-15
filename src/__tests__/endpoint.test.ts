import axios, { Method } from 'axios'
import { Endpoint } from '@/endpoint'
import { BasicMock } from '@/__tests__/mock/axios'
import { MessageBag } from '@errors/messageBag'

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

  it('the query will return response object', async (): Promise<void> => {
    await expect(new Endpoint().query('123', 'get')).toMatchSnapshot()
  })

  it('the query will return MessageBag object', (done) => {
    new Endpoint()
      .query('123', 'get', { errors: { foo: 'bar is something else.' } })
      .catch((messageBag) => {
        expect(messageBag).toBeInstanceOf(MessageBag)
        expect(messageBag.toString()).toMatchSnapshot()
        expect(messageBag.hasMessage('foo')).toMatchSnapshot()
        expect(messageBag.getMessage('foo')).toMatchSnapshot()
        expect(console.log).not.toHaveBeenCalled()
        done()
      })
  })

  it('the query will return MessageBag object and debug to console', async (): Promise<
    void
  > => {
    const endpoint = new Endpoint().debug()
    expect(endpoint.isDebugEnabled()).toMatchSnapshot()
    await expect(
      endpoint.query('123', 'get', {
        errors: { foo: 'bar is something else.' },
      }),
    ).rejects.toMatchSnapshot()
  })

  it('the responseError will return default MessageBag', () => {
    const endpoint = new Endpoint()
    const options = endpoint.queryOptions('final/path', 'get')
    const messageBag = endpoint.responseError(
      options.url as string,
      options.method as Method,
      options,
      new Error('failure to foo bar'),
    )

    expect(messageBag.message).not.toStrictEqual('failure to foo bar')
    expect(messageBag.message).toStrictEqual(messageBag.default)
    expect(messageBag.getStatus()).toStrictEqual(messageBag.defaultStatus)
    expect(messageBag.hasMessage('it')).toStrictEqual(false)

    expect(MessageBag.toString()).toMatchSnapshot()
    expect(messageBag.options).toMatchSnapshot()
    expect(messageBag.original.message).toMatchSnapshot()
    expect(messageBag.original.toString()).toMatchSnapshot()
    expect(messageBag.url).toMatchSnapshot()
    expect(messageBag.method).toMatchSnapshot()
    expect(messageBag.config).toMatchSnapshot()
    expect(messageBag.response).toMatchSnapshot()
  })
})
