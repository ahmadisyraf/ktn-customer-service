import FieldNotExistException from '../exception/field-not-exist-exception';
import FieldException from '../exception/field-exception';
import ApiException from '../exception/api-exception';

export type Class<T> = {
	new(...args: any[]): T;
	keys(): any;
};

export default class JsonUtils {

	public static toJSON(object: Record<string, any>): string {
		return JSON.stringify(object);
	}

	public static fromJSON(object: string): Record<string, any> {
		return JSON.parse(object);
	}
}
