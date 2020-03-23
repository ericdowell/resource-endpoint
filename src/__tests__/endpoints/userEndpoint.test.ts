import { UserEndpoint } from '../..'
import axios from 'axios'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)

const callEndpoint = (instance: UserEndpoint): {[key: string]: Function} => {
  return {
    current: instance.current.bind(instance),
    show: instance.show.bind(instance),
    update: instance.update.bind(instance),
    register: instance.register.bind(instance),
    resendEmailVerification: instance.resendEmailVerification.bind(instance),
    requestPasswordReset: instance.requestPasswordReset.bind(instance),
    changePassword: instance.changePassword.bind(instance),
    confirmPassword: instance.confirmPassword.bind(instance),
  }
}

describe(`${UserEndpoint.name}`, (): void => {
  it.each([
    ['current', 'get', []],
    ['show', 'get', [123, { include: ['name'] }, false]],
    ['update', 'put', [4321, { name: 'John', email: 'email' }]],
    ['register', 'post', ['email', 'email', 'password', 'password']],
    ['register', 'post', ['email', 'email', 'password', 'password', { name: 'John' }, false]],
    ['resendEmailVerification', 'post', []],
    ['requestPasswordReset', 'post', ['email']],
    ['changePassword', 'put', ['password', 'password']],
    ['confirmPassword', 'post', ['password']],
  ])('the %s calls %s parent method', async(method: string, calls, params): Promise<void> => {
    expect.assertions(2)
    const endpoint = new UserEndpoint()
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const methodCalled = jest.spyOn(endpoint, calls).mockImplementation((): any => true)
    await callEndpoint(endpoint)[method](...params)
    expect(methodCalled).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(methodCalled.mock.calls[0]).toMatchSnapshot()
  })
})
