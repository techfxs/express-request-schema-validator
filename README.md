# Express Request Schema Validator

A flexible Express.js middleware for validating request bodies, query parameters, and headers using JSON Schema (powered by AJV).

## Features

- ✅ Validate request body, query parameters, and headers
- ✅ JSON Schema support with AJV
- ✅ Format validation (email, date, URL, etc.) via ajv-formats
- ✅ Detailed error messages with schema information
- ✅ TypeScript support with full type definitions
- ✅ Works with both CommonJS and ES6 modules

## Installation

```bash
npm install express-request-schema-validator
```

## Usage

### CommonJS

```javascript
const express = require("express");
const { createMiddleware } = require("express-request-schema-validator");

const app = express();
app.use(express.json());

// Define your JSON schemas
const userSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    age: { type: "number", minimum: 0 },
    name: { type: "string", minLength: 1 },
  },
  required: ["email", "name"],
};

// Apply validation middleware
app.post("/users", createMiddleware({ bodySchema: userSchema }), (req, res) => {
  res.json({ message: "User created", user: req.body });
});

app.listen(3000);
```

### ES6 Modules

```javascript
import express from "express";
import { createMiddleware } from "express-request-schema-validator";

const app = express();
app.use(express.json());

// Define your JSON schemas
const userSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    age: { type: "number", minimum: 0 },
    name: { type: "string", minLength: 1 },
  },
  required: ["email", "name"],
};

// Apply validation middleware
app.post("/users", createMiddleware({ bodySchema: userSchema }), (req, res) => {
  res.json({ message: "User created", user: req.body });
});

app.listen(3000);
```

### TypeScript

```typescript
import express, { Request, Response } from "express";
import { createMiddleware } from "express-request-schema-validator";

const app = express();
app.use(express.json());

const userSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    age: { type: "number", minimum: 0 },
    name: { type: "string", minLength: 1 },
  },
  required: ["email", "name"],
} as const;

app.post(
  "/users",
  createMiddleware({ bodySchema: userSchema }),
  (req: Request, res: Response) => {
    res.json({ message: "User created", user: req.body });
  }
);

app.listen(3000);
```

## API

### `createMiddleware(options)`

Creates an Express middleware that validates incoming requests.

#### Options

- **`bodySchema`** _(optional)_: JSON Schema to validate request body
- **`querySchema`** _(optional)_: JSON Schema to validate query parameters
- **`headersSchema`** _(optional)_: JSON Schema to validate request headers

#### Example: Validate Multiple Parts

```javascript
const middleware = createMiddleware({
  bodySchema: {
    type: "object",
    properties: {
      username: { type: "string" },
    },
    required: ["username"],
  },
  querySchema: {
    type: "object",
    properties: {
      page: { type: "string", pattern: "^[0-9]+$" },
    },
  },
  headersSchema: {
    type: "object",
    properties: {
      "x-api-key": { type: "string", minLength: 20 },
    },
    required: ["x-api-key"],
  },
});

app.post("/api/users", middleware, (req, res) => {
  // Request is valid if we reach here
  res.json({ success: true });
});
```

## Validation Errors

When validation fails, the middleware responds with a `400` status and a JSON error object:

```json
{
  "error": "Request body validation failed",
  "schema": {
    "type": "object",
    "properties": {
      "email": { "type": "string", "format": "email" }
    },
    "required": ["email"]
  },
  "details": [
    {
      "field": "/email",
      "message": "must match format \"email\"",
      "keyword": "format",
      "params": { "format": "email" }
    }
  ]
}
```

### Error Response Fields

- **`error`**: Human-readable error message
- **`schema`**: The JSON Schema that failed validation
- **`details`**: Array of specific validation errors
  - `field`: The property path that failed
  - `message`: Error description
  - `keyword`: The validation rule that failed
  - `params`: Additional validation parameters

## Supported Formats

Thanks to `ajv-formats`, the following string formats are supported:

- `date-time`
- `date`
- `time`
- `email`
- `hostname`
- `ipv4`
- `ipv6`
- `uri`
- `url`
- `uuid`
- `regex`
- And more!

## License

ISC
