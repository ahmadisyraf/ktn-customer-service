import Metadata from './metadata';

export default class BaseModel {
	public updatedAt: string | undefined;
	public createdAt: string | undefined;
	public metadata: Metadata | undefined;
}
