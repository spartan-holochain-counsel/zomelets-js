import { Logger }			from '@whi/weblogger';
const log				= new Logger("test-basic", process.env.LOG_LEVEL );

import { expect }			from 'chai';

// import json				from '@whi/json';

import { expect_reject }		from '../utils.js';
import {
    CellZomelets,
    Zomelet,
}					from '../../src/index.js';


function basic_tests () {
    let zome_spec;
    let cell_spec;

    it("should create zome interface", async function () {
	zome_spec			= new Zomelet({
	    some_zome_fn ( args ) {
		return this.call( args );
	    },
	});

	expect( zome_spec.handlers	).to.have.keys( "some_zome_fn" );
    });

    it("should create cell interface", async function () {
	cell_spec			= new CellZomelets({
	    "zome_01": zome_spec,
	    "zome_02": {
		some_zome_fn ( args ) {
		    return this.call( args );
		},
	    },
	});

	expect( cell_spec.zomes		).to.have.keys( "zome_01", "zome_02" );
	expect( cell_spec.zomes.zome_01	).to.equal( zome_spec );
    });

}

function errors_tests () {
}

describe("Zomelets", () => {

    describe("Basic",		basic_tests );
    describe("Errors",		errors_tests );

});
