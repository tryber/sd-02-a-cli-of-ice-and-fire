const actions = require('./actions');
const { showMenuOptions } = require('../../utils');

const showBooksMenu = async (goBackToMainMenu) => {
  const action = await showMenuOptions({
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar livros', value: 'list' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });

  if (action === 'back') return goBackToMainMenu();

  const goBackToCharactersMenu = () => showBooksMenu(goBackToMainMenu);

  if (actions[action]) {
    return actions[action].run(goBackToCharactersMenu);
  }

  return false;
};

module.exports = { run: showBooksMenu };