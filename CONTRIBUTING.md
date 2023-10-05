[back to README.md](README.md)

# Contributing

## Overview
This package helps define Zomelet configuration.


## Development

### `logging()`

### Environment

- Developed using Node.js `v18.14.2`
- Enter `nix develop` for development environment dependencies.

### Building
No build is required for Node.

Bundling with Webpack is supported for web
```
npx webpack
```

### Testing

To run all tests with logging
```
make test-debug
```

- `make test-integration-debug` - **Integration tests only**
- `make test-e2e-debug` - **End-2-end tests only**

> **NOTE:** remove `-debug` to run tests without logging
