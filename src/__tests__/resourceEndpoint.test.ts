import axios from 'axios'
import { ResourceEndpoint } from '../resourceEndpoint'
import { BasicMock } from './mock/axios'

const axiosRequest = jest.spyOn(axios, 'request').mockImplementation(BasicMock)
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'log').mockImplementation((): void => {})

const createInstance = () => {
  const instance = new ResourceEndpoint()
  const storeMethod = jest.spyOn(instance, 'store')
  const updateMethod = jest.spyOn(instance, 'update')
  return { instance, storeMethod, updateMethod }
}

describe(ResourceEndpoint.name, (): void => {
  beforeEach((): void => {
    axiosRequest.mockClear()
  })

  it('the storeOrUpdate calls store when NO id is passed', () => {
    const { instance, storeMethod, updateMethod } = createInstance()
    instance.storeOrUpdate(null, { title: 'foo' })
    expect(storeMethod).toBeCalledTimes(1)
    expect(updateMethod).toBeCalledTimes(0)
  })

  it('the storeOrUpdate calls update when id is passed', () => {
    const { instance, storeMethod, updateMethod } = createInstance()
    instance.storeOrUpdate(123, { title: 'foo' })
    expect(storeMethod).toBeCalledTimes(0)
    expect(updateMethod).toBeCalledTimes(1)
  })
})
