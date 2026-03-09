type SortDirection = 'asc' | 'desc';

export type PaginationType = {
	page: number;
	limit: number;
};

export type SortType = {
	column: string;
	direction: SortDirection;
};

export interface GetAllCustomerRequest {
	pagination: PaginationType;
	sort: SortType;
}

export type CustomerBase = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	dynamicEntity: Record<string, any> | undefined;
	createdAt: string | undefined;
	updatedAt: string | undefined;
};

export type CustomerBaseWithoutPassword = Omit<CustomerBase, 'password'>;

export interface CustomerToJSON {
	includePassword(): CustomerBase;
	excludePassword(): CustomerBaseWithoutPassword;
}
