const prettyjson = require('prettyjson');
const superagent = require('superagent');
const inquirer = require('inquirer');

const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10';

const NEXT_ACTION_CHOICES = [
  {
    name: 'Voltar para busca de livros',
    value: 'back',
  },
  {
    name: 'Sair',
    value: 'exit',
  },
];

const questions = [
  {
    type: 'input',
    name: 'book',
    message: 'Digite o nome do livro corretamente: ',
  },
];

const MENU_MAIN_MESSAGE = '[Listar Livros] - Digite o nome do livro: ';

const getBookFromPage = async (pageLink) => {
  try {
    const res = await superagent.get(pageLink);
    const { body: characters, headers: { link: links } } = res;
    return { characters, links: parseLinks(links) };
  } catch (err) {
    console.error(err);
  }
};

// const removePropertiesFromCharacter = ({ books, povBooks, ...character }) =>
//   removeEmptyProperties(character);

// const createChoiceFromCharacter = (character) => ({
//   /* Uma personagem pode não ter nome. Nesses casos, a API traz a propriedade `alias`,
//          que é o que usamos aqui para mostrar a personagem na lista */
//   name: character.name || character.aliases[0],
//   value: removePropertiesFromCharacter(character),
// });

// const createChoicesList = (characters, links) => {
//   const choices = characters.map(createChoiceFromCharacter);
//   return addExtraChoices(choices, links);
// };

// /**
//  * Recebe uma escolha realizada pelo usuário.
//  * Essa escolha pode ser uma personagem, que será exibida na tela,
//  * ou o nome de uma ação a ser realizada, como voltar para o menu anterior.
//  * O segundo parâmetro recebe as funções responsáveis por exibir
//  * uma página de personagens, e por voltar para o menu principal.
//  * O segundo parâmetro também recebe os links para a próxima página anterior.
//  * @param {string} userChoice Opção escolhida pela pessoa
//  * @param {object} dependencies Funções e parâmetros necessários para controle de fluxo
//  */
// const handleUserChoice = (userChoice, { goBackToCharactersMenu, showBook, links }) => {
//   if (userChoice === 'back') return goBackToCharactersMenu();
//   if (userChoice === 'next' || userChoice === 'prev') {
//     /* A pessoa pediu para ver a próxima página, ou a página anterior.
//        Para realizar isso, chamamos a função que exibe a lista de
//        personagens mas passando o link da página escolhida.
//      */
//     return showBook(goBackToCharactersMenu, links[userChoice]);
//   }

//   console.log('===== Personagem escolhida =====');
//   /* `prettyjson` é um módulo que formata o JSON
//       para que ele seja exibido de forma "bonitinha" no terminal */
//   console.log(prettyjson.render(userChoice));
//   console.log('================================');
// };

// /**
//  * Exibe o menu da ação de listar personagens.
//  * Na primeia execução, o parâmetro `pageLink` estará vazio,
//  * o que fará com que a função `getCharactersFromPage` busque a primeira página.
//  * Quando a pessoa escolher ver a próxima página, chamamos `listCharacters`
//  * passando o link dessa próxima página.
//  * @param {Function} goBackToCharactersMenu Função que exibe o menu de personagens
//  * @param {string} pageLink Link da página a ser exibida.
//  */

const callBookName = () => inquirer.prompt(questions).then((answer) => answer.book);

const showBook = async (goBackToCharactersMenu, pageLink) => {
  const bookName = await callBookName();
  const bookLink = `https://www.anapioficeandfire.com/api/books?name=${bookName}`;

  const res = await getBookFromPage(bookLink || FIRST_PAGE_LINK);

  console.log(res);
  // const choices = createChoicesList(characters, links);

  // const userChoice = await showMenuOptions({
  //   message: MENU_MAIN_MESSAGE,
  //   choices,
  // });

  // await handleUserChoice(userChoice, {
  //   goBackToCharactersMenu,
  //   showBook,
  //   links,
  // });

  // const nextAction = await showMenuOptions({
  //   message: 'O que deseja fazer agora?',
  //   choices: NEXT_ACTION_CHOICES,
  // });

  // if (nextAction === 'back') {
  //   return goBackToCharactersMenu();
  // }

  // if (nextAction === 'repeat') {
  //   return showBook(goBackToCharactersMenu);
  // }

  // console.log('OK, até logo!');
  // process.exit(0);
};

module.exports = { run: showBook };
