const z = require('zod');

const juryRegisterShema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().isEmail(), 
  password_hash: z.string().min(6),
});

const juryLoginShema = z.object({
  email: z.string().isEmail(), 
  password_hash: z.string().min(6),
});

module.exports = { juryRegisterShema, juryLoginShema };