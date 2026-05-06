import FieldNotExistException from './field-not-exist-exception';
import FieldException from './field-exception';
import ApiException from './api-exception';

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

	public static validateObject<T>(object: Record<string, any>, target: Class<T>) {
		if (typeof target.keys !== 'function') {
			throw new ApiException(`${target.name} don't have static keys() method`);
		}

		Object.keys(object).forEach(key => {
			if (!target.keys().includes(key)) {
				throw new FieldNotExistException(key);
			}
		});

		const clone = new target() as any;

		target.keys().forEach((key: string) => {
			const classKeyType = typeof clone[key];
			const hasProperty = object.hasOwnProperty(key);
			const value = object[key];

			if (classKeyType === 'undefined') return;

			if (!hasProperty || !value) {
				throw new FieldException(key);
			}
		});
	}

}
