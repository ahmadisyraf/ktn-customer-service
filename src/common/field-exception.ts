import ApiException from './api-exception';
import { HttpStatus } from '../http-status';

export default class FieldException extends ApiException {
	constructor(field: string) {
		super('Field ' + field + ' is required but not found', { status: HttpStatus.BadRequest });
		this.name = 'FieldNotFoundException';
	}
}
