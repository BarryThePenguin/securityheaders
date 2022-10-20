// From the command line
// From node
import https from 'node:https';
import securityheaders from '.';

console.log('bash', 'securityheaders --bail www.google.com');

https.get('https://securityheaders.com', response => {
	console.log(securityheaders(response.headers));
});
