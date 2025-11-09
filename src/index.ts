import { Request, Response, NextFunction, RequestHandler } from "express";
import Ajv, { Schema, ValidateFunction, ErrorObject } from "ajv";
import addFormats from "ajv-formats";

interface ValidationSchemas {
  bodySchema?: Schema;
  querySchema?: Schema;
  headersSchema?: Schema;
}

export function createMiddleware({
  bodySchema,
  querySchema,
  headersSchema,
}: ValidationSchemas): RequestHandler {
  const ajv = new Ajv();
  addFormats(ajv);

  const validateBody: ValidateFunction | null = bodySchema
    ? ajv.compile(bodySchema)
    : null;
  const validateQuery: ValidateFunction | null = querySchema
    ? ajv.compile(querySchema)
    : null;
  const validateHeaders: ValidateFunction | null = headersSchema
    ? ajv.compile(headersSchema)
    : null;

  // ...existing code...

  return (req: Request, res: Response, next: NextFunction): void => {
    if (validateBody) {
      const valid = validateBody(req.body);
      if (!valid) {
        res.status(400).json({
          error: "Request body validation failed",
          schema: bodySchema,
          details: validateBody.errors?.map((err: ErrorObject) => ({
            field: err.instancePath || err.params?.missingProperty || "root",
            message: err.message,
            keyword: err.keyword,
            params: err.params,
          })),
        });
        return;
      }
    }

    if (validateQuery) {
      const valid = validateQuery(req.query);
      if (!valid) {
        res.status(400).json({
          error: "Query parameters validation failed",
          schema: querySchema,
          details: validateQuery.errors?.map((err: ErrorObject) => ({
            field: err.instancePath || err.params?.missingProperty || "root",
            message: err.message,
            keyword: err.keyword,
            params: err.params,
          })),
        });
        return;
      }
    }

    if (validateHeaders) {
      const valid = validateHeaders(req.headers);
      if (!valid) {
        res.status(400).json({
          error: "Headers validation failed",
          schema: headersSchema,
          details: validateHeaders.errors?.map((err: ErrorObject) => ({
            field: err.instancePath || err.params?.missingProperty || "root",
            message: err.message,
            keyword: err.keyword,
            params: err.params,
          })),
        });
        return;
      }
    }

    next();
  };
}
