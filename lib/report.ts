import chalk from 'chalk';
import {get} from 'lodash';
import figures from 'figures';

function reportResult(result, {bail, verbose}) {
	if (result.error) {
		console.log(reportError(result));

		if (bail) {
			throw result.error;
		}
	} else if (verbose) {
		console.log(reportVerbose(result));
	} else {
		console.log(reportGrade(result));
	}
}

function reportError({url, grade}) {
	return chalk`
{red ${figures.cross}} {blue ${url}}
{bold Grade}: {bold ${grade}}`;
}

function reportGrade({url, grade}) {
	return chalk`
{green ${figures.tick}} {blue ${url}}
{bold Grade}: {bold ${grade}}`;
}

function reportHeaders({response}) {
	return chalk`
{bold public-key-pins}: ${get(response, 'headers.public-key-pins')}
{bold server}: ${get(response, 'headers.server')}
{bold strict-transport-security}: ${get(
		response,
		'headers.strict-transport-security',
	)}
{bold content-security-policy}: ${get(
		response,
		'headers.content-security-policy',
	)}
{bold x-frame-options}: ${get(response, 'headers.x-frame-options')}
{bold x-xss-protection}: ${get(response, 'headers.x-xss-protection')}
{bold x-content-type-options}: ${get(
		response,
		'headers.x-content-type-options',
	)}
{bold referrer-policy}: ${get(response, 'headers.referrer-policy')}
{bold feature-policy}: ${get(response, 'headers.feature-policy')}`;
}

function reportVerbose({url, grade, response}) {
	return chalk`
${reportGrade({url, grade})}
${reportHeaders({response})}`;
}

export default reportResult;
