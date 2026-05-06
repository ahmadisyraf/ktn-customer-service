import { HttpStatus } from '../http-status';

interface ApiExceptionOptions extends ErrorOptions {
	status?: number;
}

export default class ApiException extends Error {
	public status: number;

	constructor(message: string, options?: ApiExceptionOptions) {
		super(message, options);
		this.name = 'ApiException';
		this.status = options?.status ?? HttpStatus.InternalServerError;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiException);
		}
	}
}
