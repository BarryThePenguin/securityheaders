import got, {Headers, HTTPError, Response} from 'got';
import UserAgent from 'user-agents';

const CERT_HAS_EXPIRED = 'CERT_HAS_EXPIRED';

const userAgent = new UserAgent();

type ClientOptions = {
	headers?: Headers;
};

type Result = [Error | undefined] | [null, Response<string>];

async function client(url: string, options: ClientOptions = {}): Promise<Result> {
	try {
		const response = await got(url, {headers: {'user-agent': userAgent.random().toString(), ...options.headers}});

		return [null, response];
	} catch (error) {
		return [parseError(error)];
	}
}

type ErrorResult = Error & {
	certExpired?: boolean;
	failed?: boolean;
};

function parseError(error: unknown): ErrorResult {
	if (error instanceof HTTPError) {
		let certExpired = false;
		let failed = false;

		switch (error.code) {
			case CERT_HAS_EXPIRED:
				certExpired = true;
				break;
			default:
				failed = true;
		}

		return Object.assign(error, {certExpired, failed});
	}

	return new Error('Unable to parse response');
}

export default client;
