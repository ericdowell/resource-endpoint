import { CrudEndpoint } from '../crudEndpoint'
import { AuthMixin } from '../mixins'

export class AuthEndpoint extends AuthMixin(CrudEndpoint) {}
