import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

export const setupSecurity = (app) => {
  // ✅ SECURITY: Add security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // ✅ Sanitize user input against NoSQL injection
  app.use(mongoSanitize());

  // ✅ Prevent parameter pollution
  app.use(hpp());
};

// ✅ HTTPS enforcement for production
export const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, 'https://' + req.get('host') + req.url);
  }
  next();
};
