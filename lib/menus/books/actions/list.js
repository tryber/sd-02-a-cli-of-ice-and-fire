const inquirer = require('inquirer');

const MENU_MAIN_MESSAGE = '[Procurar Livros] - Digite aqui sua busca';

const typeBookSearch = async () =>
  inquirer
    .prompt({
      type: 'input',
      name: 'inputBook',
      message: MENU_MAIN_MESSAGE,
    })
    .then(({ inputBook }) => console.log(inputBook));

module.exports = { run: typeBookSearch };
