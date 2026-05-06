import ApiException from './api-exception';
import { HttpStatus } from '../http-status';

export default class FieldNotExistException extends ApiException {
	constructor(field: string) {
		super('Field ' + field + ' is not exist in the system', { status: HttpStatus.BadRequest });
		this.name = 'FieldNotExistException';
	}
}
