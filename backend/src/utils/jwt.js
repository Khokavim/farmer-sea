const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-secret-change-me';
  }

  throw new Error('JWT_SECRET missing');
};

module.exports = { getJwtSecret };
