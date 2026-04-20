import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const response: ErrorResponse = {
      error: 'File too large',
      details: 'Maximum file size is 50MB',
    };
    return res.status(400).json(response);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const response: ErrorResponse = {
      error: 'Unexpected file field',
      details: err.message,
    };
    return res.status(400).json(response);
  }

  // Custom validation errors
  if (err.name === 'ValidationError') {
    const response: ErrorResponse = {
      error: 'Validation error',
      details: err.message,
    };
    return res.status(400).json(response);
  }

  // Default error
  const response: ErrorResponse = {
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const response: ErrorResponse = {
    error: 'Not found',
    details: `Route ${req.method} ${req.path} not found`,
  };
  res.status(404).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Made with Bob
