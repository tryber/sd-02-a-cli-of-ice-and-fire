const actions = require('./actions');
const { showMenuOptions } = require('../../utils');

const showBooksMenu = async (goBackToMainMenu) => {
  const action = await showMenuOptions({
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar livros', value: 'search' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });
  if (action === 'back') return goBackToMainMenu();

  const goBackToBooksMenu = () => showBooksMenu(goBackToMainMenu);

  if (action === 'search') return actions.list.receiveNameBook(goBackToBooksMenu);

  if (actions[action]) {
    return actions[action].run(goBackToBooksMenu);
  }
  return false;
};

module.exports = { run: showBooksMenu };
