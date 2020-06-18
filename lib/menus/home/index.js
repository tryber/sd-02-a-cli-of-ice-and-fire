const actions = require('./actions');
const { showMenuOptions } = require('../../utils');

const showHomeMenu = async (goBackToMainMenu) => {
  const action = await showMenuOptions({
    message: 'Menu de casas -- Escolha uma ação',
    choices: [
      { name: 'Listar casas', value: 'list' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });

  if (action === 'back') return goBackToMainMenu();

  const goBackToHomeMenu = () => showHomeMenu(goBackToMainMenu);

  if (actions[action]) {
    return actions[action].run(goBackToHomeMenu);
  }

  return false;
};

module.exports = { run: showHomeMenu };
