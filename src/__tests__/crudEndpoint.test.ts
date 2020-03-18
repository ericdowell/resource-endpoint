import axios from 'axios'
import { CrudEndpoint } from '../index'
import { BasicMock } from './mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)

const callEndpoint = (instance: CrudEndpoint): {[key: string]: Function} => {
  return {
    delete: instance.delete.bind(instance),
    get: instance.get.bind(instance),
    patch: instance.patch.bind(instance),
    post: instance.post.bind(instance),
    put: instance.put.bind(instance),
  }
}

describe(CrudEndpoint.name, (): void => {
  it.each([
    ['delete'],
    ['get'],
    ['patch'],
    ['post'],
    ['put'],
  ])('the "%s" method calls query on parent', async(method): Promise<void> => {
    const instance = new CrudEndpoint()
    const query = jest.spyOn(instance, 'query').mockImplementation(async(): Promise<any> => true)
    await callEndpoint(instance)[method]('path', { url: 'value' })
    expect(query.mock.calls[0]).toEqual([
      'path',
      method,
      {
        url: 'value',
      },
    ])
  })
})
