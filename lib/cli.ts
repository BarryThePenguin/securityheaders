import process from 'process';
import meow from 'meow';
import chalk from 'chalk';
import figures from 'figures';
import updateNotifier from 'update-notifier';
import client from './client.js';
import reportResult from './report.js';
import securityheaders from '.';

async function perform(url: string, {bail, grade, verbose, ...options}) {
	const [error, headers] = await client(url, options);
	const result = securityheaders(headers, {grade});

	reportResult({error, url, ...result}, {bail, verbose});
}

function exit(message: string) {
	console.error(chalk`\n{red ${figures.cross}} ${message}`);
	process.exit(1); // eslint-disable-line unicorn/no-process-exit
}

export function run() {
	const cli = meow(
		`
		Usage
		  securityheaders [<url> ...]
		
		Options
			--bail, -b
			--grade, -g
			--verbose, -v
			
		Examples
			securityheaders www.google.com github.com
	`,
		{
			importMeta: import.meta,
			flags: {
				bail: {
					type: 'boolean',
					alias: 'b',
				},
				grade: {
					type: 'string',
					alias: 'g',
				},
				verbose: {
					type: 'boolean',
					alias: 'v',
				},
			},
		},
	);

	updateNotifier({pkg: {
		name: cli.pkg.name ?? '',
		version: cli.pkg.version ?? '',
	}}).notify();

	Promise.all(cli.input.map(async url => perform(url, cli.flags))).catch(error => {
		exit(error.message);
	},
	);
}
