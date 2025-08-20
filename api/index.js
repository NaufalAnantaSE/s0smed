const { createNestApp } = require('../dist/serverless');

module.exports = async (req, res) => {
  try {
    const app = await createNestApp();
    return app.getHttpAdapter().getInstance()(req, res);
  } catch (err) {
    console.error('Serverless handler error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Internal server error', error: err.message }));
  }
};
