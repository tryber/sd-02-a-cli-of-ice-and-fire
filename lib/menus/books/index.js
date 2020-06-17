const { list } = require('./actions');
const { showMenuOptions, } = require('../../utils');

const showBooksMenu = async (goBackToMainMenu) => {
  const action = await showMenuOptions({
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar livros', value: 'search' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });
  if (action === 'search') return list.receiveNameBook();
  if (action === 'back') return goBackToMainMenu();

  return false;
};

module.exports = { run: showBooksMenu };
