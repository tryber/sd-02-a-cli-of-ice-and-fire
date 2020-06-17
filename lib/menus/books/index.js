const actions = require('./actions');
const menus = require('..');
const { showMenuOptions } = require('../../utils');

const showBooksMenu = async () => {
  const optionOrMenu = await showMenuOptions({
    message: 'Vamos escolher um livro?',
    choices: [
      { name: 'Pesquisar livro por nome', value: 'bookName' },
      { name: 'Voltar para o menu anterior', value: 'back' },
    ],
  });

  if (menus[optionOrMenu]) {
    return menus[optionOrMenu].run(showBooksMenu);
  }

  return false;
};
