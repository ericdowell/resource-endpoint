import axios from 'axios'
import { CrudEndpoint } from '../index'
import { BasicMock } from './mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)

const callEndpoint = (instance: CrudEndpoint): { [key: string]: Function } => {
  return {
    delete: instance.delete.bind(instance),
    get: instance.get.bind(instance),
    patch: instance.patch.bind(instance),
    post: instance.post.bind(instance),
    put: instance.put.bind(instance),
  }
}

describe(`${CrudEndpoint.name}`, (): void => {
  it.each([['delete'], ['get'], ['patch'], ['post'], ['put']])(
    'the "%s" method calls request on parent',
    async (method): Promise<void> => {
      expect.assertions(2)
      const instance = new CrudEndpoint()
      const request = jest.spyOn(instance, 'request').mockImplementation(async (): Promise<any> => true)
      const url = 'path'
      const params = { filter: ['value'] }
      await callEndpoint(instance)[method](url, { params })
      expect(request).toHaveBeenCalledTimes(1)
      expect(request).toHaveBeenLastCalledWith({
        url,
        method,
        params,
      })
    },
  )
})
