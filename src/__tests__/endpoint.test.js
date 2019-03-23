/* global test, expect */
import Endpoint from '../endpoint'
import MessageBag from '../errors/messageBag'

test('the origin is localhost', () => {
  const endpoint = new Endpoint()
  expect(endpoint.origin).toStrictEqual('http://localhost')
})

test('the path is empty', () => {
  const endpoint = new Endpoint()
  expect(endpoint.path).toStrictEqual('')
})

test('the endpoint is empty', () => {
  const endpoint = new Endpoint()
  expect(endpoint.endpoint).toStrictEqual('')
})

test('the getBaseUrl is localhost with trailing slash', () => {
  const endpoint = new Endpoint()
  expect(endpoint.getBaseUrl()).toStrictEqual('http://localhost/')
})

test('the queryOptions will return default options', () => {
  const endpoint = new Endpoint()
  const url = 'final/path'
  const method = 'GET'
  const options = endpoint.queryOptions(url, method)

  expect(options.url).toStrictEqual(url)
  expect(options.method).toStrictEqual(method)
  expect(options.baseURL).toStrictEqual('http://localhost/')
  expect(options.paramsSerializer).toBeDefined()
  expect(typeof options.paramsSerializer).toStrictEqual('function')
  expect(options.headers).toBeUndefined()
  expect(options.data).toBeUndefined()
  expect(Object.keys(options)).toEqual([
    'url',
    'method',
    'baseURL',
    'paramsSerializer'
  ])
})

test('the responseData will return data key of object', () => {
  const endpoint = new Endpoint()
  const data = endpoint.responseData({ data: 'test' })

  expect(data).toStrictEqual('test')
})

test('the responseError will return default MessageBag', () => {
  const endpoint = new Endpoint()
  const url = 'final/path'
  const method = 'GET'
  const message = 'failure to foo bar'
  const options = endpoint.queryOptions(url, method)
  const original = new Error(message)
  const messageBag = endpoint.responseError(url, method, options, original)

  expect(messageBag).toBeInstanceOf(MessageBag)
  expect(messageBag.message).not.toStrictEqual(message)
  expect(messageBag.options).toStrictEqual(options)
  expect(messageBag.original).toStrictEqual(original)
  expect(messageBag.original.message).toStrictEqual(message)
  expect(messageBag.message).toStrictEqual(messageBag.default)
  expect(messageBag.url).toStrictEqual(url)
  expect(messageBag.method).toStrictEqual(method)
  expect(messageBag.method).toStrictEqual(method)
  expect(messageBag.getStatus()).toStrictEqual(messageBag.defaultStatus)
  expect(messageBag.hasMessage('test')).toStrictEqual(false)
})
