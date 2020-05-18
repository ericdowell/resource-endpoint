import { CrudEndpoint } from './crud'
import { AuthMixin } from '../mixins'

export class AuthEndpoint extends AuthMixin(CrudEndpoint) {}
