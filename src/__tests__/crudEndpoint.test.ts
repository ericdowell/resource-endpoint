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

describe(`${CrudEndpoint.name}`, (): void => {
  it.each([
    ['delete'],
    ['get'],
    ['patch'],
    ['post'],
    ['put'],
  ])('the "%s" method calls request on parent', async(method): Promise<void> => {
    expect.assertions(1)
    const instance = new CrudEndpoint()
    const request = jest.spyOn(instance, 'request').mockImplementation(async(): Promise<any> => true)
    await callEndpoint(instance)[method]('path', { url: 'value' })
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(request.mock.calls[0]).toMatchSnapshot()
  })
})
