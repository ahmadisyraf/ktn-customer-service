import Api from './api';
import CreateCustomer from './create-customer';
import LoadCustomer from './load-customer';
import UpdateCustomer from './update-customer';


export default class CustomerService {
	public api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	public createCustomer(): CreateCustomer {
		return new CreateCustomer(this.api);
	}

	public loadCustomer(): LoadCustomer {
		return new LoadCustomer(this.api);
	}

	public updateCustomer(): UpdateCustomer {
		return new UpdateCustomer(this.api);
	}
}
