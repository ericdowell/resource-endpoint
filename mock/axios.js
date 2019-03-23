export function BasicMock(options) {
  return new Promise((resolve, reject) => {
    if (options.errors) {
      return reject({
        config: {},
        response: {
          data: {
            errors: options.errors
          },
          status: options.status || 422
        }
      })
    }
    return resolve({
      config: {},
      data: { foo: 'bar' }
    })
  })
}
