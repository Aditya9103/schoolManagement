import ApiError from '../utils/ApiError.js';

/**
 * validate.middleware.js — Joi request validation middleware.
 * Validates request body, query, and params against provided Joi schemas.
 * 
 * Supports both:
 * 1. Schema object: { body?: Joi.Schema, query?: Joi.Schema, params?: Joi.Schema }
 * 2. Direct Joi object schema: Joi.object(...)
 */
const validate = (schema) => (req, res, next) => {
    if (!schema) return next();

    // Check if schema is a dictionary with body/query/params schemas
    const isSchemaMap = schema.body || schema.query || schema.params;

    if (isSchemaMap) {
        for (const [key, subSchema] of Object.entries(schema)) {
            if (subSchema && typeof subSchema.validate === 'function') {
                const { error, value } = subSchema.validate(req[key], {
                    abortEarly: false,
                    stripUnknown: true,
                });
                if (error) {
                    const message = error.details.map((d) => d.message).join(', ');
                    return next(ApiError.badRequest(message));
                }
                req[key] = value;
            }
        }
        return next();
    }

    if (typeof schema.validate === 'function') {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const message = error.details.map((d) => d.message).join(', ');
            return next(ApiError.badRequest(message));
        }
        req.body = value;
        return next();
    }

    return next();
};

export default validate;
