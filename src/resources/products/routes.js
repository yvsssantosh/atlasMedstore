/**
 * Imports
 */
import Joi from 'joi';

// API endpoint handlers
import {
    ProductsHandler,
    ProductIdHandler,
    ProductsUploadHandler
} from './handlers';

/**
 * Routes
 */
export default [
    {
        path: '',
        method: 'GET',
        config: {
            handler: {async: ProductsHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get products collection',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().optional()
                }).unknown(),
                query: {
                    sku: Joi.string().optional(),
                    collections: Joi.string().optional(),
                    tags: Joi.string().optional(),
                    sort: Joi.string().optional(),
                    perPage: Joi.string().optional(),
                    page: Joi.string().optional()
                }
            }
        }
    },
    {
        path: '/{chemicalComposition}',
        method: 'GET',
        config: {
            handler: {async: ProductsHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get products collection having certain chemical composition',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().optional()
                }).unknown(),
                query: {
                    composition: Joi.string().optional(),
                    sku: Joi.string().optional(),
                    collections: Joi.string().optional(),
                    tags: Joi.string().optional(),
                    sort: Joi.string().optional(),
                    perPage: Joi.string().optional(),
                    page: Joi.string().optional()
                }
            }
        }
    },
    {
        path: '',
        method: 'POST',
        config: {
            handler: {async: ProductsHandler.post},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Create new product',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                payload: {
                    sku: Joi.string().required(),
                    medicine: Joi.object({
                        activeIngredient: Joi.string().required(),
                        costPerUnit: Joi.string().required(),
                        dosageForm: Joi.string().optional(),
                        currency: Joi.string().optional(),
                        manufacturerName: Joi.string().required(),
                        name: Joi.string().required(),
                        chemical_composition_id: Joi.string().required(),
                        manufacturer_id: Joi.string().required()
                    }).required()
                }
            }
        }
    },
    {
        path: '/{productId}',
        method: 'GET',
        config: {
            handler: {async: ProductIdHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get product',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().optional()
                }).unknown(),
                params: {
                    productId: Joi.string().required().description('the id for the product'),
                }
            }
        }
    },
    {
        path: '/{productId}',
        method: 'PUT',
        config: {
            handler: {async: ProductIdHandler.put},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Update all product details',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                params: {
                    productId: Joi.string().required().description('the id for the product'),
                },
                payload: {
                    enabled: Joi.boolean().required(),
                    sku: Joi.string().required(),
                    medicine: Joi.object({
                        activeIngredient: Joi.string().required(),
                        costPerUnit: Joi.string().required(),
                        dosageForm: Joi.string().optional(),
                        manufacturerName: Joi.string().required(),
                        name: Joi.string().required(),
                        relatedDrugs: Joi.array({
                            form: Joi.string().required(),
                            manufacturer: Joi.string().required(),
                            name: Joi.string().required(),
                            price: Joi.string().required(),
                        }).optional()
                    }).required()
                }
            }
        }
    },
    {
        path: '/{productId}',
        method: 'PATCH',
        config: {
            handler: {async: ProductIdHandler.patch},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Partial product update',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                params: {
                    productId: Joi.string().required().description('the id for the product'),
                }
            }
        }
    },
    {
        path: '/upload',
        method: 'POST',
        config: {
            handler: {async: ProductsUploadHandler.post},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Upload catalog information',
            notes: 'Product content CSV and bulk image operations can be done using this endpoint',
            tags: ['api'],
            payload: {
                output: 'stream',
                parse: true
            },
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                payload: {
                    resource: Joi.string().required(),
                    file: Joi.object().optional(),
                    action: Joi.string().optional()
                }
            }
        }
    }
];
