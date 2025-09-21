// ✅ Centralized error handling
export const errorHandler = (err, req, res, next) => {
  // ✅ Log error for debugging (but not sensitive info)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // ✅ Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // ✅ Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: isDevelopment ? err.errors : undefined,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
    });
  }

  // ✅ Default error response
  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
    stack: isDevelopment ? err.stack : undefined,
  });
};

// ✅ 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
