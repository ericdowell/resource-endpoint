const Endpoint = require('./src/endpoint')
const CrudEndpoint = require('./src/crudEndpoint')
const ResourceEndpoint = require('./src/resourceEndpoint')

const ApiEndpoint = require('./src/apiEndpoint')
const CrudApiEndpoint = require('./src/crudApiEndpoint')
const ResourceApiEndpoint = require('./src/resourceApiEndpoint')

const MessageBag = require('./src/errors/messageBag')

module.exports = {
    MessageBag,
    Endpoint,
    CrudEndpoint,
    ResourceEndpoint,
    ApiEndpoint,
    CrudApiEndpoint,
    ResourceApiEndpoint,
}