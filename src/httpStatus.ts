/**
 * Standard HTTP response status codes.
 * Used to indicate the success or failure of an API request.
 */
export enum HttpStatus {
	// --- 2xx Success ---

	/** 200 OK: The request has succeeded. Standard response for successful GET/PUT/PATCH. */
	OK = 200,

	/** 201 Created: The request has succeeded and a new resource has been created. Ideal for POST. */
	Created = 201,

	/** 204 No Content: The server successfully processed the request, but is not returning any content. */
	NoContent = 204,

	// --- 3xx Redirection ---

	/** 301 Moved Permanently: The URL of the requested resource has been changed permanently. */
	MovedPermanently = 301,

	/** 302 Found: The resource resides temporarily under a different URI. Common for temporary redirects. */
	Found = 302,

	/** 303 See Other: Redirects the client to get the requested resource at another URI with a GET request. */
	SeeOther = 303,

	// --- 4xx Client Errors ---

	/** 400 Bad Request: The server cannot process the request due to client error (e.g., malformed syntax). */
	BadRequest = 400,

	/** 401 Unauthorized: The client must authenticate itself to get the requested response. */
	Unauthorized = 401,

	/** 403 Forbidden: The client does not have access rights to the content (e.g., wrong permissions). */
	Forbidden = 403,

	/** 404 Not Found: The server cannot find the requested resource. */
	NotFound = 404,

	/** 409 Conflict: The request conflicts with the current state of the server (e.g., duplicate entry). */
	Conflict = 409,

	/** 422 Unprocessable Entity: The request was well-formed but was unable to be followed due to semantic errors (e.g., validation failed). */
	UnprocessableEntity = 422,

	// --- 5xx Server Errors ---

	/** 500 Internal Server Error: The server has encountered a situation it doesn't know how to handle. */
	InternalServerError = 500,

	/** 501 Not Implemented: The server does not support the functionality required to fulfill the request. */
	NotImplemented = 501,

	/** 502 Bad Gateway: The server, while acting as a gateway, received an invalid response from the upstream server. */
	BadGateway = 502,

	/** 503 Service Unavailable: The server is not ready to handle the request (e.g., down for maintenance). */
	ServiceUnavailable = 503,
}
