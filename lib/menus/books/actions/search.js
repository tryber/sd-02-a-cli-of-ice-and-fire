/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
const prettyjson = require('prettyjson');
const superagent = require('superagent');
const inquirer = require('inquirer');
const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const NEXT_ACTION_CHOICES = [
  {
    name: 'Sair',
    value: 'exit',
  },
];

const MENU_MAIN_MESSAGE = '[Listar Livros] - Escolha um livro para ver mais detalhes';
const SEARCH_API = 'https://anapioficeandfire.com/api/books?name=';


const removePropertiesFromBookTitles = ({ characters, povCharacters, ...bookTitles }) =>
  removeEmptyProperties(bookTitles);

const createChoiceFromBookTitles = (bookTitles) => ({
  /* Uma personagem pode não ter nome. Nesses casos, a API traz a propriedade `alias`,
         que é o que usamos aqui para mostrar a personagem na lista */
  name: bookTitles.name || bookTitles.aliases[0],
  value: removePropertiesFromBookTitles(bookTitles),
});

const createChoicesList = (bookTitles, links) => {
  const choices = bookTitles.map(createChoiceFromBookTitles);
  return addExtraChoices(choices, links);
};

/**
 * Recebe uma escolha realizada pelo usuário.
 * Essa escolha pode ser uma personagem, que será exibida na tela,
 * ou o nome de uma ação a ser realizada, como voltar para o menu anterior.
 * O segundo parâmetro recebe as funções responsáveis por exibir
 * uma página de personagens, e por voltar para o menu principal.
 * O segundo parâmetro também recebe os links para a próxima página anterior.
 * @param {string} userChoice Opção escolhida pela pessoa
 * @param {object} dependencies Funções e parâmetros necessários para controle de fluxo
 */
const handleUserChoice = (userChoice, { backToBooks, showBooks, links }) => {
  if (userChoice === 'back') return backToBooks();
  if (userChoice === 'next' || userChoice === 'prev') {
    /* A pessoa pediu para ver a próxima página, ou a página anterior.
       Para realizar isso, chamamos a função que exibe a lista de
       personagens mas passando o link da página escolhida.
     */
    return showBooks(backToBooks, links[userChoice]);
  }

  console.log('===== Livro escolhido =====');
  /* `prettyjson` é um módulo que formata o JSON
      para que ele seja exibido de forma "bonitinha" no terminal */
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

/**
 * Exibe o menu da ação de listar personagens.
 * Na primeia execução, o parâmetro `pageLink` estará vazio,
 * o que fará com que a função `getCharactersFromPage` busque a primeira página.
 * Quando a pessoa escolher ver a próxima página, chamamos `listCharacters`
 * passando o link dessa próxima página.
 * @param {Function} backToBooks Função que exibe o menu de personagens
 * @param {string} pageLink Link da página a ser exibida.
 */

const getBooks = async (showBooks, backToBooks, pageLink, title) => {
  const actualLink = pageLink || `${SEARCH_API}${title}`;
  const response = await superagent.get(`${actualLink}`)
    .catch((err) => console.log(err.message));
  const content = response.body;

  if (Object.keys(content).length === 0) {
    console.log('Nenhum livro encontrado para essa pesquisa');
    return backToBooks();
  }
  // Home-cooked function for removing properties from objects
  // const books = content.map((book) => Object.keys(book)
  //   .filter((key) => (key !== 'characters' && key !== 'povCharacters'))
  //   .reduce((obj, prop) => Object.assign(obj, { [prop]: book[prop] }), {}));

  const links = parseLinks(response.headers.link);

  return { content, links };
};

const inputTitle = () => inquirer.prompt(
  {
    type: 'input',
    name: 'bookName',
    message: 'Qual o nome do livro que gostaria de conhecer melhor?',
  },
).then(({ bookName }) => bookName);

const showBooks = async (backToBooks, pageLink, title) => {
  const newTitle = title === undefined ? pageLink || await inputTitle() : title;

  const { content, links } = await getBooks(showBooks, backToBooks, pageLink, newTitle);

  const choices = createChoicesList(content, links);

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  if ( userChoice !== 'back' && userChoice !== 'next') {
    await handleUserChoice(userChoice, {
      backToBooks,
      showBooks,
      links,
    });
    
    return showBooks(backToBooks, pageLink, newTitle)
  }

  if (userChoice === 'back') {
    return backToBooks();
  }

  if (userChoice === 'repeat') {
    return showBooks(backToBooks);
  }

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { run: showBooks };
