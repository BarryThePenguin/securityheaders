import url from 'url';
import test from 'ava';
import client from '../lib/client.js';
import securityheaders from '..';

async function macro(t, hostname) {
	const input = url.format({
		path: '/',
		protocol: 'https',
		hostname,
	});

	const [, headers] = await client(input);
	const actual = securityheaders(headers);

	t.snapshot(actual);
}

test('dashlane.com', macro, 'dashlane.com');
test('github.com', macro, 'github.com');
test('readingeggs.com.au', macro, 'readingeggs.com.au');
test('scotthelme.co.uk', macro, 'scotthelme.co.uk');
test('sso.readingeggs.com', macro, 'sso.readingeggs.com');
test('twitter.com', macro, 'twitter.com');
test('www.domain.com.au', macro, 'www.domain.com.au');
test('www.ebay.com.au', macro, 'www.ebay.com.au');
test('www.facebook.com', macro, 'www.facebook.com');
test('www.google.com.au', macro, 'www.google.com.au');
test('www.gumtree.com.au', macro, 'www.gumtree.com.au');
test('www.jbhifi.com.au', macro, 'www.jbhifi.com.au');
