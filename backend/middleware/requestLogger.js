const { jlog } = require('../utils/logger');

function requestLogger(req, res, next) {
  req.reqId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const start = Date.now();

  jlog('http_request', {
    method: req.method,
    path: req.path,
    query: Object.keys(req.query).length ? req.query : undefined,
  });

  res.on('finish', () => {
    jlog('http_response', {
      status: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
}

module.exports = { requestLogger };
