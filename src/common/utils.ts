export default class Utils {

	public static toJSON(object: Record<string, any>): Record<string, any> {
		return JSON.parse(JSON.stringify(object));
	}


	public static mapToObject<T>(data: Record<string, any>, target: new () => T) {
		const instance = new target();
		if (data) {
			Object.assign(instance as object, data);
		}
		return instance;
	}

}
