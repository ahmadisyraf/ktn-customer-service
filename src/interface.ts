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
