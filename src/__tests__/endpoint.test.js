/* global test, expect */
import Endpoint from '../endpoint'
import MessageBag from '../errors/messageBag'

test('the origin is localhost', () => {
  expect(new Endpoint().origin).toMatchSnapshot()
})

test('the path is empty', () => {
  expect(new Endpoint().path).toStrictEqual('')
})

test('the endpoint is empty', () => {
  expect(new Endpoint().endpoint).toStrictEqual('')
})

test('the getBaseUrl is localhost with trailing slash', () => {
  expect(new Endpoint().getBaseUrl()).toMatchSnapshot()
})

test('the queryOptions will return default options', () => {
  const options = new Endpoint().queryOptions('final/path', 'GET')
  expect(options).toMatchSnapshot()
})

test('the responseData will return data key of object', () => {
  const data = new Endpoint().responseData({ data: 'test' })
  expect(data).toMatchSnapshot()
})

test('the responseError will return default MessageBag', () => {
  const endpoint = new Endpoint()
  const options = endpoint.queryOptions('final/path', 'GET')
  const messageBag = endpoint.responseError(
    options.url,
    options.method,
    options,
    new Error('failure to foo bar')
  )

  expect(messageBag).toBeInstanceOf(MessageBag)
  expect(messageBag.message).not.toStrictEqual('failure to foo bar')
  expect(messageBag.message).toStrictEqual(messageBag.default)
  expect(messageBag.getStatus()).toStrictEqual(messageBag.defaultStatus)
  expect(messageBag.hasMessage('test')).toStrictEqual(false)

  expect(MessageBag.toString()).toMatchSnapshot()
  expect(messageBag.options).toMatchSnapshot()
  expect(messageBag.original.message).toMatchSnapshot()
  expect(messageBag.original.toString()).toMatchSnapshot()
  expect(messageBag.url).toMatchSnapshot()
  expect(messageBag.method).toMatchSnapshot()
})
