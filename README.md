[![](https://img.shields.io/npm/v/@spartan-hc/zomelets/latest?style=flat-square)](http://npmjs.com/package/@spartan-hc/zomelets)

# Zomelets
Tools for defining configuration according to the Zomelet Specification.

[![](https://img.shields.io/github/issues-raw/spartan-holochain-counsel/zomelets-js?style=flat-square)](https://github.com/spartan-holochain-counsel/zomelets-js/issues)
[![](https://img.shields.io/github/issues-closed-raw/spartan-holochain-counsel/zomelets-js?style=flat-square)](https://github.com/spartan-holochain-counsel/zomelets-js/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/spartan-holochain-counsel/zomelets-js?style=flat-square)](https://github.com/spartan-holochain-counsel/zomelets-js/pulls)


## Overview

The design problem is that the knowledge required to use coordinator interfaces is overwhelming when
a process depends on a cascade of other zome functions or even other cell's zome functions.

Coordinator zome functions are necessary when you need a series of commits to pass or fail all
together, but if that is not required it is better to capture the coordination logic on the
front-end.  However, moving logic to the front-end puts all the responsibility of following that
logic on the client-side.  Zomelets make it so that a developer can make a re-usable zome and ship
the front-end logic with it.  This allows front-end developers to call Zomelet functions as if they
were defined in the coordinator zome.

The simplest example of something that cannot be done by a coordinator zome is file uploading.  The
logic must be on the client-side because we cannot send large payloads to a coordinator zome
function.  It must be split into chunks and created by the front-end.  A Zomelet function can
contain the knowledge of all the subcalls required to save a file so that the front-end consumer
only has to call that 1 function.


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
