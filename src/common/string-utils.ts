export default class StringUtils {

	public static isNullOrEmpty(value: string) {
		return value === null || value === undefined || value.trim().length === 0;
	}
}
