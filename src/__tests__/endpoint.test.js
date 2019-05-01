/* global test, expect, jest */
import axios from 'axios'
import Endpoint from '../endpoint'
import { BasicMock } from '../../mock/axios'
import MessageBag from '../errors/messageBag'

jest.mock('axios')
jest.spyOn(global.console, 'log')

axios.mockImplementation(BasicMock)

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

test('the headers default is empty', () => {
  expect(new Endpoint().hasHeaders()).toMatchSnapshot()
  expect(new Endpoint().headers).toMatchSnapshot()
})

test('the setHeaders updates headers value', () => {
  const endpoint = new Endpoint().setHeader('Accept', 'application/json')
  expect(endpoint.hasHeaders()).toMatchSnapshot()
  expect(endpoint.headers).toMatchSnapshot()
})

test('the queryOptions will return default options', () => {
  const options = new Endpoint().queryOptions('final/path', 'get')
  expect(options).toMatchSnapshot()
})

test('the responseData will return data key of object', () => {
  const data = new Endpoint().responseData({ data: 'test' })
  expect(data).toMatchSnapshot()
})

test('the query will return response object', done => {
  new Endpoint().query('123', 'get').then(response => {
    expect(response).toMatchSnapshot()
    done()
  })
})

test('the query will return MessageBag object', done => {
  new Endpoint()
    .query('123', 'get', { errors: { foo: 'bar is something else.' } })
    .catch(messageBag => {
      expect(messageBag).toBeInstanceOf(MessageBag)
      expect(messageBag.toString()).toMatchSnapshot()
      expect(messageBag.hasMessage('foo')).toMatchSnapshot()
      expect(messageBag.getMessage('foo')).toMatchSnapshot()
      expect(console.log).not.toHaveBeenCalled()
      done()
    })
})

test('the query will return MessageBag object and debug to console', done => {
  const endpoint = new Endpoint().debug()
  expect(endpoint.isDebugEnabled()).toMatchSnapshot()
  endpoint
    .query('123', 'get', { errors: { foo: 'bar is something else.' } })
    .catch(messageBag => {
      expect(messageBag).toBeInstanceOf(MessageBag)
      expect(messageBag.toString()).toMatchSnapshot()
      expect(messageBag.hasMessage('foo')).toMatchSnapshot()
      expect(messageBag.getMessage('foo')).toMatchSnapshot()
      expect(console.log).toHaveBeenCalled()
      done()
    })
})

test('the responseError will return default MessageBag', () => {
  const endpoint = new Endpoint()
  const options = endpoint.queryOptions('final/path', 'get')
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
  expect(messageBag.config).toMatchSnapshot()
  expect(messageBag.response).toMatchSnapshot()
})
