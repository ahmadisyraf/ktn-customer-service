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

/**
 * @description convert to client object
 * @returns {CustomerToJSON}
 */
export interface CustomerToJSON {
	/**
	 * @description return client object with password
	 * @returns {CustomerBase}
	 */
	includePassword(): CustomerBase;
	/**
	 * @description return client object without password
	 * @returns {CustomerBaseWithoutPassword}
	 */
	excludePassword(): CustomerBaseWithoutPassword;
}
