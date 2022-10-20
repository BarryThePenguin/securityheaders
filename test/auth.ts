import test from 'ava';
import got from 'got';
import cheerio from 'cheerio';
import FormData from 'form-data';
import {CookieJar} from 'tough-cookie';
import client from '../lib/client.js';
import securityheaders from '..';

test('app.readingeggs.com', async t => {
	const cookieJar = new CookieJar();

	const loginResponse = await got('https://sso.readingeggs.com/login', {
		cookieJar,
	});
	const $ = cheerio.load(loginResponse.body);
	const authenticityToken = $('input[name="authenticity_token"]').val();

	const form = new FormData();
	form.append('utf8', '✓');
	form.append('authenticity_token', authenticityToken);
	form.append('username', 'teacher_au');
	form.append('password', '123456');
	form.append('commit', 'Let me in');

	try {
		await got.post('https://sso.readingeggs.com/login', {
			body: form,
			cookieJar,
			headers: {
				authority: 'sso.readingeggs.com',
			},
		});
	} catch (error) {
		if (error.statusCode !== 302) {
			throw error;
		}

		const {location} = error.headers;
		const [, headers] = await client(location, {cookieJar});
		const actual = securityheaders(headers);

		t.deepEqual(actual, {
			grade: 'C',
			hasContentSecurityPolicy: false,
			hasFeaturePolicy: false,
			hasPublicKeyPins: false,
			hasReferrerPolicy: false,
			hasServer: true,
			hasStrictTransportSecurity: false,
			hasXContentTypeOptions: true,
			hasXFrameOptions: true,
			hasXXssProtection: true,
			score: 3,
		});
	}
});
