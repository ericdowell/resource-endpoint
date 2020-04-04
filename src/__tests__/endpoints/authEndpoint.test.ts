import { AuthEndpoint } from '../..'
import axios from 'axios'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)

const callEndpoint = (instance: AuthEndpoint): { [key: string]: Function } => {
  return {
    login: instance.login.bind(instance),
    logout: instance.logout.bind(instance),
    register: instance.register.bind(instance),
    requestPasswordReset: instance.requestPasswordReset.bind(instance),
    resetPassword: instance.resetPassword.bind(instance),
  }
}

describe(`${AuthEndpoint.name}`, (): void => {
  it('login method defaults to remember equal to true', async(): Promise<
    void
  > => {
    expect.assertions(2)
    const endpoint = new AuthEndpoint()
    const post = jest.spyOn(endpoint, 'post').mockImplementation((): any => true)
    await endpoint.login('email', 'password')
    expect(post).toHaveBeenCalledTimes(1)
    expect(post.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/login",
        Object {
          "data": Object {
            "email": "email",
            "password": "password",
            "remember": true,
          },
        },
      ]
    `)
  })

  it('register methods sets attributes first so passed values are not overridden', async(): Promise<
    void
  > => {
    expect.assertions(1)
    const instance = new AuthEndpoint()
    const post = jest
      .spyOn(instance, 'post')
      .mockImplementation(async(): Promise<any> => true)
    const email = 'email'
    const password = 'password'
    const attributes = { email: 'fooBar', password: 'fooBar' }
    await instance.register(email, email, password, password, attributes)
    expect(post.mock.calls[0][1]).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "email": "email",
        "email_confirmation": "email",
        "password": "password",
        "password_confirmation": "password",
        "remember": true,
      },
    }
    `)
  })

  it.each([
    ['login', 'post', ['email', 'password', false]],
    ['logout', 'post', []],
    ['register', 'post', ['email', 'email', 'password', 'password', { name: 'John' }, false]],
    ['requestPasswordReset', 'post', ['email']],
    ['resetPassword', 'post', ['email', 'token', 'password', 'password']],
  ])(
    'the %s calls %s parent method',
    async(method: string, calls, params): Promise<void> => {
      expect.assertions(2)
      const endpoint = new AuthEndpoint()
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const methodCalled = jest.spyOn(endpoint, calls).mockImplementation((): any => true)
      await callEndpoint(endpoint)[method](...params)
      expect(methodCalled).toHaveBeenCalledTimes(1)
      // eslint-disable-next-line jest/prefer-inline-snapshots
      expect(methodCalled.mock.calls[0]).toMatchSnapshot()
    },
  )
})
