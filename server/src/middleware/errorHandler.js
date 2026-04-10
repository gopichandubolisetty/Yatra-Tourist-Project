function errorHandler(err, req, res, next) {
  console.error('YATRA Error:', err.message || err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong on YATRA';
  res.status(status).json({
    message,
    app: 'Yatra',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

function notFound(req, res) {
  res.status(404).json({ message: 'Route not found — YATRA' });
}

module.exports = { errorHandler, notFound };
