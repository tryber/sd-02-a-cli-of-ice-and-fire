const actions = require('./actions');
const { showMenuOptions } = require('./utils');

async function showMenu(dependences, goBackToMainMenu) {
  const { name } = dependences;

  const action = await showMenuOptions({
    message: `'Menu de ${name} -- Escolha uma ação'`,
    choices: [
      { name: `Listar ${name}`, value: 'list' },
      { name: `Pesquisar ${name}`, value: 'search' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });

  if (action === 'back') return goBackToMainMenu();

  const goBackToMenu = () => showMenu(dependences, goBackToMainMenu);

  if (actions[action]) {
    return actions[action].run(dependences, goBackToMenu);
  }

  return;
}

module.exports = { run: showMenu }
