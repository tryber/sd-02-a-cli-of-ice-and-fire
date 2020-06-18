const dependences = require('./dependences');
const { showMenuOptions } = require('./utils');

const showMainMenu = async () => {
  const optionOrMenu = await showMenuOptions({
    message: 'Boas vindas! Escolha um menu para continuar',
    choices: [
      { name: 'Personagens', value: 'characters' },
      { name: 'Livros', value: 'books' },
      { name: 'Casas', value: 'houses' },
      { name: 'Sair', value: 'exit' },
    ],
  });

  if (optionOrMenu === 'exit') return console.log('OK... Até mais!');

  if (menus[optionOrMenu]) {
    return menus[optionOrMenu].run(showMainMenu);
  }

  return false;
};

module.exports = { run: showMainMenu };
