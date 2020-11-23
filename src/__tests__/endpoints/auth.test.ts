import { AuthEndpoint } from '../../endpoints'
import axios from 'axios'
import { BasicMock } from '../mock/axios'

jest.spyOn(axios, 'request').mockImplementation(BasicMock)

const callEndpoint = (instance: AuthEndpoint): { [key: string]: any } => {
  return {
    login: instance.login.bind(instance),
    logout: instance.logout.bind(instance),
    register: instance.register.bind(instance),
    requestPasswordReset: instance.requestPasswordReset.bind(instance),
    resetPassword: instance.resetPassword.bind(instance),
  }
}
const email = 'email'
const emailConfirmation = email
const password = 'password'
const passwordConfirmation = password

describe(`${AuthEndpoint.name}`, (): void => {
  it('login method defaults to remember equal to true', async (): Promise<void> => {
    expect.assertions(2)
    const endpoint = new AuthEndpoint()
    const post = jest.spyOn(endpoint, 'post').mockImplementation((): any => true)
    await endpoint.login({ email, password })
    expect(post).toHaveBeenCalledTimes(1)
    expect(post.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "login",
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

  it('register methods sets attributes first so passed values are not overridden', async (): Promise<void> => {
    expect.assertions(1)
    const instance = new AuthEndpoint()
    const post = jest.spyOn(instance, 'post').mockImplementation(async (): Promise<any> => true)
    await instance.register({ email, emailConfirmation, password, passwordConfirmation })
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
    ['login', 'post', [{ email, password, remember: false }]],
    ['logout', 'post', []],
    [
      'register',
      'post',
      [{ email, emailConfirmation, password, passwordConfirmation, name: 'John', remember: false }],
    ],
    ['requestPasswordReset', 'post', [email]],
    ['resetPassword', 'post', [{ email, token: 'token', password, passwordConfirmation }]],
  ])(
    'the %s calls %s parent method',
    async (method: string, calls, params): Promise<void> => {
      expect.assertions(2)
      const endpoint = new AuthEndpoint()
      const methodCalled = jest.spyOn(endpoint, calls).mockImplementation((): any => true)
      await callEndpoint(endpoint)[method](...params)
      expect(methodCalled).toHaveBeenCalledTimes(1)
      // eslint-disable-next-line jest/prefer-inline-snapshots
      expect(methodCalled.mock.calls[0]).toMatchSnapshot()
    },
  )
})
