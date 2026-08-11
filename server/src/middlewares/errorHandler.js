/**
 * Socket.IO async error wrapper utility
 * Catches unhandled errors inside socket event listeners and emits a turn:error payload to client
 */
export const wrapSocketHandler = (socket, fn) => async (...args) => {
  try {
    await fn(...args);
  } catch (err) {
    console.error(`[Socket Error - ${socket.id}]:`, err);
    socket.emit('turn:error', {
      success: false,
      message: err.message || 'An unexpected server error occurred during voice processing.',
      errors: [err.toString()]
    });
  }
};

/**
 * Standard Express HTTP error handling middleware
 */
export const httpErrorHandler = (err, req, res, next) => {
  console.error('[HTTP Error]:', err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: [err.toString()]
  });
};


