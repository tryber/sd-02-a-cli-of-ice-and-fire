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

const printInfos = (userChoice) => {
  console.log('===== Livro escolhido =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const returnFunction = (pageLink, books, showBooksList, goBackToBooksMenu) => {
  const returnPage = pageLink || FIRST_PAGE_LINK;
  const returnBook = books.length === 1 && !pageLink ? books : null;
  return showBooksList(goBackToBooksMenu, returnPage, returnBook);
};

const handleUserChoice = (userChoice,
  { goBackToBooksMenu, showBooksList, links }, books, pageLink) => {
  if (userChoice === 'back') return goBackToBooksMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showBooksList(goBackToBooksMenu, links[userChoice]);
  }

  printInfos(userChoice);

  return returnFunction(pageLink, books, showBooksList, goBackToBooksMenu);
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

const getBook = async (pageLink, search = '') => {
  try {
    const res = await superagent.get(`${pageLink}${search}`);
    const booksFoundArray = res.body;
    const links = parseLinks(res.headers.link);
    return { booksFoundArray, links };
  } catch (err) {
    console.error(err);
  }
};

const typeBookSearch = async (pageLink) =>
  inquirer
    .prompt({
      type: 'input',
      name: 'inputBook',
      message: MENU_MAIN_MESSAGE,
    })
    .then(({ inputBook }) => getBook(pageLink, inputBook));

const adjustResults = (book, booksFoundArray, pageLink, links) => {
  const books = book || booksFoundArray;
  const adjPageLink = book ? '' : pageLink;
  const adjLink = book ? {} : links;
  return { books, adjPageLink, adjLink };
};

const showBooksList = async (goBackToBooksMenu, pageLink, book) => {
  const resultsObj = pageLink ? await getBook(pageLink) : await typeBookSearch(FIRST_PAGE_LINK);
  const { booksFoundArray, links } = resultsObj;
  if (!booksFoundArray.length) {
    console.log('Nenhum livro encontrado para essa pesquisa');
    return goBackToBooksMenu();
  }

  const { books, adjPageLink, adjLink } = adjustResults(book, booksFoundArray, pageLink, links);

  const choices = createChoicesList(books, adjLink);

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  await handleUserChoice(userChoice,
    { goBackToBooksMenu, showBooksList, links }, books, adjPageLink);

  const nextAction = await showMenuOptions({
    message: 'O que deseja fazer agora?',
    choices: NEXT_ACTION_CHOICES,
  });

  if (nextAction === 'back') return goBackToBooksMenu();

  if (nextAction === 'repeat') return showBooksList(goBackToBooksMenu);

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { run: showBooksList };
