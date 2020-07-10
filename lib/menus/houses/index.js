const actions = require('./actions');
const { showMenuOptions } = require('../../utils');

const showHousesMenu = async (goBackToMainMenu) => {
  const action = await showMenuOptions({
    message: 'Menu de Casas -- Escolha uma ação',
    choices: [
      { name: 'Listar casas', value: 'listHouses' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });

  if (action === 'back') return goBackToMainMenu();

  const goBackToCharactersMenu = () => showHousesMenu(goBackToMainMenu);

  if (actions[action]) {
    return actions[action].run(goBackToCharactersMenu);
  }

  return false;
};

module.exports = { run: showHousesMenu };
