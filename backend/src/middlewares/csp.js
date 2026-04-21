export default function cspMiddleware(req, res, next) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; connect-src 'self' ${frontendUrl} ${backendUrl}; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';`
  );
  next();
}
