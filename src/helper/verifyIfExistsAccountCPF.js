const customers = require('./customers')

module.exports = function verifyIfExistsAccountCPF(req, res, next){
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.data.cpf === cpf);

  if(!customer){
    return res.status(400).json({error: 'Customer not found!'})
  }

  req.customer = customer;

  return next()
}

