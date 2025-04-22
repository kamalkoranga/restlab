const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// In-memory data store (in a real app, this would be a database)
let resources = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
  ],
  products: [
    { id: 1, name: 'Laptop', price: 999.99, inStock: true },
    { id: 2, name: 'Smartphone', price: 499.99, inStock: false }
  ]
};

/**
 * Generic PUT endpoint for updating resources
 * Route: PUT /api/:resource/:id
 */
router.put(
  '/:resource/:id',
  [
    // Validation middleware for request body
    body().isObject().withMessage('Request body must be a JSON object'),
    body('id').optional().isNumeric().withMessage('ID must be a number if provided')
  ],
  (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get parameters from URL
    const { resource, id } = req.params;
    const resourceId = parseInt(id, 10);
    
    // Log request
    logger.info(`PUT request received for ${resource}/${id}`, {
      method: 'PUT',
      resource,
      id,
      body: req.body
    });

    // Check if the resource type exists
    if (!resources[resource]) {
      return res.status(404).json({
        error: `Resource type '${resource}' not found`
      });
    }

    // Find the resource by ID
    const resourceIndex = resources[resource].findIndex(item => item.id === resourceId);
    
    if (resourceIndex === -1) {
      return res.status(404).json({
        error: `${resource} with id ${id} not found`
      });
    }

    // Get the existing resource
    const existingResource = resources[resource][resourceIndex];
    
    // Update the resource (merge existing data with new data)
    const updatedResource = {
      ...existingResource,
      ...req.body,
      id: resourceId // Ensure ID doesn't change
    };

    // Save the updated resource
    resources[resource][resourceIndex] = updatedResource;

    // Add artificial delay to simulate network latency (optional)
    setTimeout(() => {
      // Return success response
      res.status(200).json({
        message: `${resource} updated successfully`,
        data: updatedResource
      });
    }, 200); // 200ms delay for simulation
  }
);

/**
 * Specialized PUT endpoint for users
 * Route: PUT /api/users/:id
 */
router.put(
  '/users/:id',
  [
    // Validation middleware for user updates
    body('name').optional().isString().withMessage('Name must be a string'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"')
  ],
  (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.id, 10);
    
    // Find the user
    const userIndex = resources.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        error: `User with id ${userId} not found`
      });
    }

    // Get the existing user
    const existingUser = resources.users[userIndex];
    
    // Update the user
    const updatedUser = {
      ...existingUser,
      ...req.body,
      id: userId // Ensure ID doesn't change
    };

    // Save the updated user
    resources.users[userIndex] = updatedUser;

    // Return success response
    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  }
);

/**
 * Specialized PUT endpoint for products
 * Route: PUT /api/products/:id
 */
router.put(
  '/products/:id',
  [
    // Validation middleware for product updates
    body('name').optional().isString().withMessage('Name must be a string'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('inStock').optional().isBoolean().withMessage('inStock must be a boolean')
  ],
  (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productId = parseInt(req.params.id, 10);
    
    // Find the product
    const productIndex = resources.products.findIndex(product => product.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({
        error: `Product with id ${productId} not found`
      });
    }

    // Get the existing product
    const existingProduct = resources.products[productIndex];
    
    // Update the product
    const updatedProduct = {
      ...existingProduct,
      ...req.body,
      id: productId // Ensure ID doesn't change
    };

    // Save the updated product
    resources.products[productIndex] = updatedProduct;

    // Return success response
    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct
    });
  }
);

module.exports = router;