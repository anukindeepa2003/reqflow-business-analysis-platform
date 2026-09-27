import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

interface RequestSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

type RequestPart = keyof RequestSchemas;

export const validateRequest = (schemas: RequestSchemas): RequestHandler => {
  return (request, response, next) => {
    const validated: Partial<Record<RequestPart, unknown>> = {};

    for (const part of Object.keys(schemas) as RequestPart[]) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(request[part]);

      if (!result.success) {
        response.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'The request contains invalid data.',
            details: result.error.issues.map((issue) => ({
              field: [part, ...issue.path].join('.'),
              message: issue.message,
            })),
          },
        });
        return;
      }

      validated[part] = result.data;
    }

    response.locals.validated = validated;
    next();
  };
};
