import { Logger }			from '@whi/weblogger';
const log				= new Logger("zomelets", (import.meta.url === import.meta.main) && process.env.LOG_LEVEL );

import utils				from './utils.js';
import { Base }				from './base_classes.js';


export class Transformer extends Base {
    #name				= null;
    #input_fn				= null;
    #output_fn				= null;

    constructor ( handler, name, options ) {
	if ( arguments[0]?.constructor?.name === "Transformer" )
	    return arguments[0];

	super( options );

	this.#name			= name || Math.random().toString(16).slice(2,8);

	if ( handler.input ) {
	    if ( typeof handler.input !== "function" )
		throw new TypeError(`Transformer input handler must be a function`);

	    this.#input_fn		= handler.input;
	}

	if ( handler.output ) {
	    if ( typeof handler.output !== "function" )
		throw new TypeError(`Transformer output handler must be a function`);

	    this.#output_fn		= handler.output;
	}
    }

    get name () {
	return this.#name;
    }

    get has_input_transformer () {
	return !!this.#input_fn;
    }

    get has_output_transformer () {
	return !!this.#output_fn;
    }

    async transformInput ( input ) {
	if ( !this.has_input_transformer )
	    throw new Error(`Transformer ${this.name} does not have an input transformer`);

	return await this.#input_fn( input ) || input;
    }

    async transformOutput ( output ) {
	if ( !this.has_output_transformer )
	    throw new Error(`Transformer ${this.name} does not have an output transformer`);

	return await this.#output_fn( output ) || output;
    }
}
utils.set_tostringtag( Transformer, "Transformer" );


export class Interface extends Base {
    #context				= null;
    #transformers			= [];

    constructor ( context, options ) {
	super( options );

	this.#context			= context;
    }

    get context () {
	return this.#context;
    }

    get transformers () {
	return this.#transformers.slice();
    }

    get transformers_reversed () {
	const transformers		= this.#transformers.slice();

	transformers.reverse();

	return transformers;
    }

    get input_transformers () {
	return this.transformers_reversed.filter(
	    transformer => transformer.has_input_transformer
	);
    }

    get output_transformers () {
	return this.transformers.filter(
	    transformer => transformer.has_output_transformer
	);
    }

    addTransformers ( transformers ) {
	for ( let transformer of transformers ) {
	    this.addTransformer( transformer );
	}

	return this.transformers;
    }

    addTransformer ( config ) {
	const transformer		= new Transformer( config );

	this.#transformers.push( transformer );

	return transformer;
    }

    async processInput ( input ) {
	// console.log("Starting input for ctx '%s':", this.context, input );
	for ( let transformer of this.input_transformers ) {
	    input			= await transformer.transformInput( input );
	    this.log.trace("Transformed input using '%s':", transformer.name, input );
	}

	return input;
    }

    // Should the output order be reversed?
    async processOutput ( output ) {
	// console.log("Starting output for ctx '%s':", this.context, output );
	for ( let transformer of this.output_transformers ) {
	    output			= await transformer.transformOutput( output );
	    this.log.trace("Transformed output using '%s':", transformer.name, output );
	}

	return output;
    }
}
utils.set_tostringtag( Interface, "Interface" );


export class CellZomelets extends Interface {
    #zomes				= {};

    constructor ( config = {}, options ) {
	if ( arguments[0]?.constructor?.name === "CellZomelets" )
	    return arguments[0];

	super( "Cell", options );

	// TODO: should validate the config structure

	for ( let [name, handler] of Object.entries( config ) ) {
	    this.setZomelet( name, handler );
	}
    }

    get zomes () {
	return Object.assign( {}, this.#zomes );
    }

    setZomelet ( name, zome_spec ) {
	this.#zomes[ name ]		= new Zomelet( zome_spec, this.options );
    }
}
utils.set_tostringtag( CellZomelets, "CellZomelets" );


export class Zomelet extends Interface {
    #handlers				= {};
    #zomes				= {};
    #cells				= {};

    constructor ( config, options ) {
	if ( arguments[0]?.constructor?.name === "Zomelet" )
	    return arguments[0];

	super( "Zome", options );

	// TODO: should validate the config structure

	for ( let [name, handler] of Object.entries( config ) ) {
	    this.setFunction( name, handler );
	}

	if ( options?.zomes ) {
	    for ( let [name, zomelet] of Object.entries( options.zomes ) ) {
		this.setPeerZome( name, zomelet );
	    }
	}

	if ( options?.cells ) {
	    for ( let [role_name, cell_spec] of Object.entries( options.cells ) ) {
		this.setPeerCell( role_name, cell_spec );
	    }
	}
    }

    get handlers () {
	return Object.assign( {}, this.#handlers );
    }

    get zomes () {
	return Object.assign( {}, this.#zomes );
    }

    get cells () {
	return Object.assign( {}, this.#cells );
    }

    setFunction ( name, handler ) {
	this.#handlers[ name ]		= normalizeFunctionHandler( name, handler );
    }

    setPeerZome ( name, zomelet ) {
	this.#zomes[ name ]		= new Zomelet( zomelet );
    }

    setPeerCell ( name, cell_spec ) {
	this.#cells[ name ]		= new CellZomelets( cell_spec );
    }
}
utils.set_tostringtag( Zomelet, "Zomelet" );


function noop_handler ( args ) {
    return this.call( args );
}

function normalizeFunctionHandler ( name, handler ) {
    // log.trace("Zome function '%s' handler input:", name, handler );
    if ( handler === true )
	return noop_handler;

    if ( typeof handler === "function" )
	return handler;

    if ( !(handler.input || handler.output) )
	throw new Error(`Zome function handler must be a function or have input/output methods`);

    if ( handler.input && typeof handler.input !== "function" )
	throw new Error(`Zome function handler input must be a function`);

    if ( handler.output && typeof handler.output !== "function" )
	throw new Error(`Zome function handler output must be a function`);

    // log.trace("Zome function '%s' handler result:", name, handler );
    return async function ( input ) {
	if ( handler.input )
	    input		= handler.input( input ) || input;

	let output		= await this.call( input );

	if ( handler.output )
	    output		= handler.output( output ) || output;

	return output;
    };
}


export default {
    Transformer,
    Interface,
    CellZomelets,
    Zomelet,
}
