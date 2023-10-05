[![](https://img.shields.io/npm/v/@spartan-hc/zomelets/latest?style=flat-square)](http://npmjs.com/package/@spartan-hc/zomelets)

# Zomelets
Tools for defining configuration according to the Zomelet Specification.

[![](https://img.shields.io/github/issues-raw/spartan-holochain-counsel/zomelets-js?style=flat-square)](https://github.com/spartan-holochain-counsel/zomelets-js/issues)
[![](https://img.shields.io/github/issues-closed-raw/spartan-holochain-counsel/zomelets-js?style=flat-square)](https://github.com/spartan-holochain-counsel/zomelets-js/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/spartan-holochain-counsel/zomelets-js?style=flat-square)](https://github.com/spartan-holochain-counsel/zomelets-js/pulls)


## Install

```bash
npm i @spartan-hc/zomelets
```

## Simplest Usage

```js
import { EntryHash } from '@spartan-hc/holo-hash';
import { Zomelet } from '@spartan-hc/zomelets';

export const ThingZomelet = new Zomelet({
    async create_thing ( thing ) {
        return new EntryHash( await this.call( thing ) );
    },

    // Virtual functions
    async create_things ( things = [] ) {
        return await Promise.all( things.map( thing => this.functions.create_thing(thing) ) );
    },
});
```


### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
