const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ 
      message: "Invalid data",
      errors: err.errors 
    });
  }
};

export default validate;