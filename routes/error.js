router.get('/intentional-error', (req, res, next) => {
    const error = new Error('Intentional Error');
    error.status = 500;
    next(error);
  });
  