import { CrudEndpoint } from '../crudEndpoint'
import { UserMixin } from '../mixins'

export class UserEndpoint extends UserMixin(CrudEndpoint) {}
