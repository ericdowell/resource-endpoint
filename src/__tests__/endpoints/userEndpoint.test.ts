import { UserEndpoint } from '../..'
import axios from 'axios'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)

const callEndpoint = (instance: UserEndpoint): {[key: string]: Function} => {
  return {
    show: instance.show.bind(instance),
    update: instance.update.bind(instance),
    register: instance.register.bind(instance),
    resendEmailVerification: instance.resendEmailVerification.bind(instance),
    requestPasswordReset: instance.requestPasswordReset.bind(instance),
    changePassword: instance.changePassword.bind(instance),
  }
}

describe(UserEndpoint.name, (): void => {
  it.each([
    ['show', 'get', [123, { include: ['name'] }, false]],
    ['update', 'put', [4321, { name: 'John', email: 'email' }]],
    ['register', 'post', ['email', 'email', 'password', 'password']],
    ['register', 'post', ['email', 'email', 'password', 'password', { name: 'John' }, false]],
    ['resendEmailVerification', 'post', []],
    ['requestPasswordReset', 'post', ['email']],
    ['changePassword', 'put', ['current', 'password', 'password']],
  ])('the %s calls %s parent method', async(method: string, calls, params): Promise<void> => {
    const endpoint = new UserEndpoint()
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const methodCalled = jest.spyOn(endpoint, calls).mockImplementation((): any => true)
    await callEndpoint(endpoint)[method](...params)
    expect(methodCalled).toHaveBeenCalledTimes(1)
    expect(methodCalled.mock.calls[0]).toMatchSnapshot()
  })
})
