import { CrudEndpoint } from './crud'
import { UserMixin } from '../mixins'

export class UserEndpoint extends UserMixin(CrudEndpoint) {}
