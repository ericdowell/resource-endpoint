import { CrudEndpoint } from '../crudEndpoint'
import { ApiEndpointMixin } from '../mixins'

export class CrudApiEndpoint extends ApiEndpointMixin(CrudEndpoint) {}
