const { Router } = require("express");
const { v4: uuidv4 } = require('uuid')
const customers = require('../helper/customers')
const verifyIfExistsAccountCPF = require('../helper/verifyIfExistsAccountCPF')
const getBalance = require('../helper/getBalance')


const routes = Router();

/**
 * cpf - string
 * name - string
 * id - uuid
 * statemen - Array
 */

routes.post('/account', (req, res) => {
  
  const { cpf, name } = req.body;


  const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

  if (customerAlreadyExists) {
    return res.status(400).json({ error: 'Customer already exists!' })
  }

  customers.push({
    id: uuidv4(),
    data: {
      cpf,
      name,
      statement: []
    }
  })

  return res.status(201).send()
});

routes.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req

  return res.json(customer.statement)
})

routes.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
  };

  customer.statement.push(statementOperation);

  return res.status(201).send();

})

routes.post('/withdraw', verifyIfExistsAccountCPF, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement)

  if (balance < amount) {
    return res.status(400).json({ error: 'Insuficient funds!' })
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit'
  }

  customer.statement.push(statementOperation)

  return res.status(201).send()
})

routes.get('/statement/date', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

  return res.json(statement)
})

routes.put('/account', verifyIfExistsAccountCPF, (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return res.status(201).send();
})

routes.get('/account', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.status(200).send(customer);
})

routes.delete('/account', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  customers.splice(customer, 1);

  return res.status(200).json(customers)
})

routes.get('/balance', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  const balance = getBalance(customer.statement)

  return res.json({
    message: 'Saldo em conta',
    moeda: 'R$',
    balance: balance
  })


})

module.exports = routes