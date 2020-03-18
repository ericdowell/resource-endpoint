import axios from 'axios'
import { ResourceEndpoint } from '../index'
import { BasicMock } from './mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation((): void => {})

const callEndpoint = (instance: ResourceEndpoint): {[key: string]: Function} => {
  return {
    index: instance.index.bind(instance),
    store: instance.store.bind(instance),
    show: instance.show.bind(instance),
    update: instance.update.bind(instance),
    destroy: instance.destroy.bind(instance),
  }
}

describe(ResourceEndpoint.name, (): void => {
  it.each([
    ['index', 'get', [{ filter: 'bar' }]],
    ['store', 'post', [{ foo: 'bar' }, { filter: 'baz' }]],
    ['show', 'get', [{ filter: 'baz' }]],
    ['store', 'post', [{ foo: 'bar' }, { filter: 'baz' }]],
    ['update', 'put', [1234, { foo: 'bar' }, { filter: 'baz' }]],
    ['destroy', 'delete', [1234, { filter: 'baz' }]],
  ])('the %s calls %s', async(method: string, calls, params): Promise<void> => {
    const endpoint = new ResourceEndpoint()
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const methodCalled = jest.spyOn(endpoint, calls).mockImplementation((): any => true)
    await callEndpoint(endpoint)[method](...params)
    expect(methodCalled).toHaveBeenCalledTimes(1)
    expect(methodCalled.mock.calls[0]).toMatchSnapshot()
  })

  it.each([
    [null],
    [123],
  ])('the storeOrUpdate calls store or update id is %p', (id: any) => {
    const endpoint = new ResourceEndpoint()
    const store = jest.spyOn(endpoint, 'store').mockImplementation((): any => true)
    const update = jest.spyOn(endpoint, 'update').mockImplementation((): any => true)
    endpoint.storeOrUpdate(id, { title: 'foo' })
    expect(store).toBeCalledTimes(id ? 0 : 1)
    expect(update).toBeCalledTimes(id ? 1 : 0)
  })
})
