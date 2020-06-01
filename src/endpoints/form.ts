import { CrudEndpoint } from './crud'
import { FormMixin, HandleErrorMixin } from '../mixins'

export class FormEndpoint extends HandleErrorMixin(FormMixin(CrudEndpoint)) {}
