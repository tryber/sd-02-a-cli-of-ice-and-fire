// const inquirer = require('inquirer');
const actions = require('./actions');
const { showMenuOptions } = require('../../utils');

// const inputUserToSearch = async () => {
//   inquirer
//     .prompt(
//       [
//         {
//           type: 'input',
//           name: 'book',
//           message: 'Qual o livro? que você deseja ver os dados?'
//         },
//       ],
//     )
//     .then((answers) => answers);
// };

const showOptionsToSearch = async (goBackToMainMenu) => {
  const action = await showMenuOptions({
    message: 'Menu de Livros - Opções',
    choices: [
      { name: 'Pesquisar Livros', value: 'search' },
      { name: 'Voltar para o menu principal', value: 'back' },
    ],
  });

  if (action === 'back') return goBackToMainMenu();

  const goBackToCharactersMenu = () => showOptionsToSearch(goBackToMainMenu);

  if (actions[action]) {
    return actions[action].run(goBackToCharactersMenu);
  }

  return false;
};

module.exports = { run: showOptionsToSearch };
