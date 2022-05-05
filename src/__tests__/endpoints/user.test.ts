import axios from 'axios'
import { UserEndpoint } from '../../endpoints'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)

const callEndpoint = (instance: UserEndpoint): Record<string, any> => {
  return {
    current: instance.current.bind(instance),
    show: instance.show.bind(instance),
    update: instance.update.bind(instance),
    resendEmailVerification: instance.resendEmailVerification.bind(instance),
    changePassword: instance.changePassword.bind(instance),
    confirmPassword: instance.confirmPassword.bind(instance),
  }
}

const password = 'password'
const currentPassword = 'current'
const passwordConfirmation = password

describe(`${UserEndpoint.name}`, (): void => {
  it.each([
    ['current', 'get', []],
    ['show', 'get', [123, { include: ['name'] }, false]],
    ['update', 'put', [4321, { name: 'John', email: 'email' }]],
    ['resendEmailVerification', 'post', []],
    ['changePassword', 'put', [{ currentPassword, password, passwordConfirmation }]],
    ['changePassword', 'put', [{ password, passwordConfirmation }]],
    ['confirmPassword', 'post', [password]],
  ])('the %s calls %s parent method', async (method: string, calls, params): Promise<void> => {
    expect.assertions(2)
    const endpoint = new UserEndpoint()
    const methodCalled = jest.spyOn(endpoint, calls).mockImplementation((): any => true)
    await callEndpoint(endpoint)[method](...params)
    expect(methodCalled).toHaveBeenCalledTimes(1)
    expect(methodCalled.mock.calls[0]).toMatchSnapshot()
  })
})
