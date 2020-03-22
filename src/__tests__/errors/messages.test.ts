import * as messages from '../../errors/messages'

describe('errors/messages', (): void => {
  it.each([
    [undefined, undefined],
    [undefined, 'default message'],
    [{ data: { message: 'message' } }, undefined],
  ])('getFallbackMessage returns message based on input', (response, defaultMessage): void => {
    expect.assertions(1)
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(messages.getFallbackMessage(response, defaultMessage)).toMatchSnapshot()
  })

  it.each([
    [undefined],
    [{ data: { errors: {} } }],
  ])('getErrors returns error object based on input', (response): void => {
    expect.assertions(1)
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(messages.getErrors(response)).toMatchSnapshot()
  })

  it.each([
    [undefined],
    [{ status: 404 }],
  ])('getStatus returns status code based on input', (response): void => {
    expect.assertions(1)
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(messages.getStatus(response)).toMatchSnapshot()
  })

  it.each([
    ['test', undefined],
    ['test', { data: { errors: { test: ['testing errors'] } } }],
  ])('hasMessage returns boolean based on input', (key, response): void => {
    expect.assertions(1)
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(messages.hasMessage(key, response)).toMatchSnapshot()
  })

  it.each([
    ['test', undefined, 'default message'],
    ['test', { data: { errors: { test: ['testing errors'] } } }, undefined],
  ])('getMessage returns string based on input', (key, response, defaultMessage): void => {
    expect.assertions(1)
    // eslint-disable-next-line jest/prefer-inline-snapshots
    expect(messages.getMessage(key, response, defaultMessage)).toMatchSnapshot()
  })
})
