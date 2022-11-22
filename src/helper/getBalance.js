module.exports = function getBalance(statement){
  //Pega todos os valores e transforma em um unico valor 
  const balance = statement.reduce((acc, operation) => {
    if(operation.type === 'credit'){
      return acc + operation.amount
    }else{
      return acc - operation.amount
    }
  }, 0)

  return balance;
}