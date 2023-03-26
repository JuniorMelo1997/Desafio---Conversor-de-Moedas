const inquirer = require("inquirer");
const chalk = require("chalk");
const converting = {};
require('dotenv').config()

const currencyChoices = [
    "ARS - PESO ARGENTINO",
    "AUD - DOLAR AUSTRALIANO",
    "BOB - BOLIVIANO DA BOLIVIA",
    "BRL - REAL BRASILEIRO",
    "CAD - DOLAR CANADENSE",
    "CLP - PESO CHILENO",
    "CNY - YUAN CHINES",
    "COP - PESO COLOMBIANO",
    "EUR - EURO",
    "GBP - PESO BRITANICO",
    "JPY - YEN JAPONES",
    "MXN - PESO MEXICANO",
    "PEN - NOVO SOL PERUANO",
    "PYG - GUARANI PARAGUAI",
    "USD - DOLAR AMERICANO"
  ];

const operation = ()=>{inquirer.prompt([
    {
      type: 'list',
      name: 'fromCurrency',
      message: chalk.bgGreen('Qual a moeda inicial?'),
      choices: currencyChoices
    }
  ]).then((answer)=> { 
    converting.fromCurrency = answer.fromCurrency.split(" ")[0];

    inquirer.prompt([        
      {
            type: 'input',
            name: 'amount',
            message: chalk.bgGreen('Qual o valor a ser convertido?')
      }]).then((answer)=>{
        converting.amount = answer.amount;
        
        inquirer.prompt([            
            {
                type: 'list',
                name: 'toCurrency',
                message: chalk.bgGreen('Para qual moeda será feita a conversão?'),
                choices: currencyChoices
            }
        ]).then((answer)=>{
            converting.toCurrency = answer.toCurrency.split(" ")[0];
            
            console.log(converting);
            
            convertCurrency(converting).then((value)=>{
                console.log(value);
            })
        })
      })
    }).catch(err=> console.log(err));
}

const convertCurrency = async ({fromCurrency, toCurrency, amount})=>{
    const myHeaders = new Headers();
    myHeaders.append("apikey", process.env.API_KEY);

    const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
    };

    fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`, requestOptions)
    .then(response => response.text())
    .then(result => {
        const convertedValue = JSON.parse(result);
        console.log(chalk.bgGreen(`O valor convertido é ${toCurrency} ${convertedValue.result}`));
    })
    .catch(error => console.log('error', error));
}

operation();