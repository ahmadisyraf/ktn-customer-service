export default abstract class BaseModel {
	public updatedAt: string | undefined;
	public createdAt: string | undefined;
	public metadata: Record<string, any> = {};

}
