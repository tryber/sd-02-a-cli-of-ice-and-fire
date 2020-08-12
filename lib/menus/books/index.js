/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const actions = require('./actions');
const { showMenuOptions } = require('../../utils');

const showBooksMenu = async (goBackToMainMenu) => {
  const action = await showMenuOptions({
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar Livros', value: 'search' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });

  if (action === 'back') return goBackToMainMenu();

  const goBackToBooksMenu = () => showBooksMenu(goBackToMainMenu);

  if (actions[action]) {
    return actions[action].run(goBackToBooksMenu);
  }

  return false;
};

module.exports = { run: showBooksMenu };
