const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ 
      message: "Données invalides",
      errors: err.errors 
    });
  }
};

module.exports = validate;