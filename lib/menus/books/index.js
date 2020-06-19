const actions = require('./actions');
const { showMenuOptions } = require('../../utils');

const showBooksMenu = async (goBackToMainMenu) => {
  const optionOrMenu = await showMenuOptions({
    message: 'Vamos escolher um livro?',
    choices: [
      { name: 'Pesquisar livro por nome', value: 'bookName' },
      { name: 'Voltar para o menu anterior', value: 'back' },
    ],
  });

  if (optionOrMenu === 'back') {
    return goBackToMainMenu();
  }

  const goBackToBooksMenu = () => showBooksMenu(goBackToMainMenu);

  if (actions[optionOrMenu]) {
    return actions[optionOrMenu].run(goBackToBooksMenu);
  }
  return false;
};

module.exports = { run: showBooksMenu };
