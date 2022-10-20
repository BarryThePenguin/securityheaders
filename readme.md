# securityheaders

## Installation

[npm][]:

```bash
npm install remark-usage
```

## Usage

From the command line

```bash
securityheaders --bail www.google.com
```

From node

```javascript
const https = require('https');
const securityheaders = require('securityheaders');
https.get('https://securityheaders.com', res => {
	console.log(securityheaders(res.headers));
});
```

## CLI

```markdown
$ securityheaders --help


  Usage
    securityheaders [<url> ...]

  Options
  	--bail, -b
  	--grade, -g
  	--verbose, -v
	
  Examples
  	securityheaders www.google.com github.com

```

## API

### `securityheaders(headers[, options])`

#### `options`

##### `options.grade`

Minimum grade required to pass

[npm]: https://docs.npmjs.com/cli/install
