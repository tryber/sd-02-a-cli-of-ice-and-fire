const dependences = require('./dependences');
const menus = require('./menus');
const { showMenuOptions } = require('./utils');

async function showMainMenu() {
  const optionMenu = await showMenuOptions({
    message: 'Boas vindas! Escolha um menu para continuar',
    choices: [
      { name: 'Personagens', value: 'characters' },
      { name: 'Livros', value: 'books' },
      { name: 'Casas', value: 'houses' },
      { name: 'Sair', value: 'exit' },
    ],
  });

<<<<<<< HEAD
  if (optionMenu === 'exit') return console.log('OK... Até mais!');
=======
  if (optionOrMenu === 'exit') {
    console.log('OK... Até mais!');
    process.exit(0);
  }
>>>>>>> master

  if (dependences[optionMenu]) {
    return menus.run(dependences[optionMenu], showMainMenu);
  }

  return;
}

module.exports = { run: showMainMenu };
