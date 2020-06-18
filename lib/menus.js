const actions = require('./actions');
const { showMenuOptions } = require('./utils');

async function showMenu(dependences, goBackToMainMenu) {
  const { name } = dependences;

  const action = await showMenuOptions({
    message: `'Menu de ${name[0]} -- Escolha uma ação'`,
    choices: [
      { name: `Listar ${name[0]}`, value: 'list' },
      { name: `Pesquisar ${name[0]}`, value: 'search' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });

  if (action === 'back') return goBackToMainMenu();

  const goBackToMenu = () => showMenu(dependences, goBackToMainMenu);

  if (actions[action]) {
    return actions[action].run(dependences, goBackToMenu);
  }
}

module.exports = { run: showMenu };
