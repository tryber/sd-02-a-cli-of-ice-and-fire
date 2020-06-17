const inquirer = require('inquirer');
const superagent = require('superagent');
const prettyjson = require('prettyjson');

const {
  parseLinks,
  addExtraChoices,
  showMenuOptions,
  removeEmptyProperties,
} = require('../../../utils');

const MENU_MAIN_MESSAGE = '[Procurar Livros] - Digite aqui sua busca';
const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/books?page=1&pageSize=10&name=';

const NEXT_ACTION_CHOICES = [
  {
    name: 'Voltar para o menu de livros',
    value: 'back',
  },
  {
    name: 'Exibir outro livro',
    value: 'repeat',
  },
  {
    name: 'Sair',
    value: 'exit',
  },
];

const getBook = async (pageLink, search) => {
  try {
    const res = await superagent.get(`${pageLink}${search}`);
    const booksFoundArray = res.body;
    const links = booksFoundArray.length < 10 ? 0 : parseLinks(res.headers.link);
    return { booksFoundArray, links };
  } catch (err) {
    console.error(err);
  }
};

const handleUserChoice = (userChoice, { goBackToBooksMenu, showBooksList, links }) => {
  if (userChoice === 'back') return goBackToBooksMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showBooksList(goBackToBooksMenu, links[userChoice]);
  }

  console.log('===== Livro escolhido =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const removePropertiesFromCharacter = ({ characters, povCharacters, ...books }) =>
  removeEmptyProperties(books);

const createChoiceFromBook = (book) => ({
  name: book.name,
  value: removePropertiesFromCharacter(book),
});

const createChoicesList = (books, links) => {
  const choices = books.map(createChoiceFromBook);
  return addExtraChoices(choices, links);
};

const typeBookSearch = async (pageLink) =>
  inquirer
    .prompt({
      type: 'input',
      name: 'inputBook',
      message: MENU_MAIN_MESSAGE,
    })
    .then(({ inputBook }) => getBook(pageLink, inputBook));


const showBooksList = async (goBackToBooksMenu, pageLink) => {
  let resultsObj = {};
  if (!pageLink) {
    resultsObj = await typeBookSearch(FIRST_PAGE_LINK);
  }

  if (pageLink) {
    resultsObj = await getBook(pageLink);
  }

  const { booksFoundArray, links } = resultsObj;

  if (!booksFoundArray.length) {
    console.log('Nenhum livro encontrado para essa pesquisa');
    return goBackToBooksMenu();
  }

  const choices = createChoicesList(booksFoundArray, links);

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  await handleUserChoice(userChoice, {
    goBackToBooksMenu,
    showBooksList,
    links,
  });

  const nextAction = await showMenuOptions({
    message: 'O que deseja fazer agora?',
    choices: NEXT_ACTION_CHOICES,
  });

  if (nextAction === 'back') {
    return goBackToBooksMenu();
  }

  if (nextAction === 'repeat') {
    return showBooksList(goBackToBooksMenu);
  }

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { run: showBooksList };
