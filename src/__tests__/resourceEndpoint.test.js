/* global test, expect, jest */
import axios from 'axios'
import ResourceEndpoint from '../resourceEndpoint'
import { BasicMock } from '../../mock/axios'

jest.mock('axios')
jest.spyOn(global.console, 'log').mockImplementation(() => {})

axios.mockImplementation(BasicMock)

const createInstance = () => {
  const instance = new ResourceEndpoint()
  const storeMethod = jest.spyOn(instance, 'store')
  const updateMethod = jest.spyOn(instance, 'update')
  return { instance, storeMethod, updateMethod }
}

test('the storeOrUpdate calls store when NO id is passed', () => {
  const { instance, storeMethod, updateMethod } = createInstance()
  instance.storeOrUpdate(null, { title: 'foo' })
  expect(storeMethod).toBeCalledTimes(1)
  expect(updateMethod).toBeCalledTimes(0)
})

test('the storeOrUpdate calls update when id is passed', () => {
  const { instance, storeMethod, updateMethod } = createInstance()
  instance.storeOrUpdate(123, { title: 'foo' })
  expect(storeMethod).toBeCalledTimes(0)
  expect(updateMethod).toBeCalledTimes(1)
})
