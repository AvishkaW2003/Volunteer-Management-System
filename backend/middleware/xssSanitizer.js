const sanitize = (val) => {
  if (typeof val === "string") {
    // Strip HTML tags to prevent XSS without corrupting normal text
    return val.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, "");
  }
  if (Array.isArray(val)) {
    return val.map(sanitize);
  }
  if (val !== null && typeof val === "object") {
    const sanitized = {};
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        // Skip sanitizing password fields to avoid altering user credentials
        if (key.toLowerCase().includes("password")) {
          sanitized[key] = val[key];
        } else {
          sanitized[key] = sanitize(val[key]);
        }
      }
    }
    return sanitized;
  }
  return val;
};

const xssSanitizer = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        req.query[key] = sanitize(req.query[key]);
      }
    }
  }
  if (req.params) {
    for (const key in req.params) {
      if (Object.prototype.hasOwnProperty.call(req.params, key)) {
        req.params[key] = sanitize(req.params[key]);
      }
    }
  }
  next();
};

export default xssSanitizer;
