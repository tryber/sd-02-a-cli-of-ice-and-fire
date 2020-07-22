/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const actions = require('./actions');
const { showMenuOptions } = require('../../utils');

const showHousesMenu = async (goBackToMainMenu) => {
  const action = await showMenuOptions({
    message: 'Menu de casas -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar Casas', value: 'listHouses' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });

  if (action === 'back') return goBackToMainMenu();

  const goBackToHousesMenu = () => showHousesMenu(goBackToMainMenu);

  if (actions[action]) {
    return actions[action].run(goBackToHousesMenu);
  }

  return false;
};

module.exports = { run: showHousesMenu };
