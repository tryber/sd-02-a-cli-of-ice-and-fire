const prettyjson = require('prettyjson');
const superagent = require('superagent');
const inquirer = require('inquirer');

const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const getBooks = (URL) =>
  superagent.get(URL)
    .then(({ headers, body }) => {
      const books = body;
      const links = parseLinks(headers.link);
      return { books, links };
    })
    .catch((err) => console.error(err));

const removePropertiesFromBook = ({ characters, povCharacters, ...book }) =>
  removeEmptyProperties(book);

const showBookDetails = (book) => ({
  name: book.name,
  value: removePropertiesFromBook(book),
});

const createChoicesList = (books, links) => {
  const choices = books.map(showBookDetails);
  return addExtraChoices(choices, links);
};

const handleUserChoice = (userChoice, { goBackToBooksMenu, showBooksList, links }) => {
  if (userChoice === 'back') return goBackToBooksMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showBooksList(goBackToBooksMenu, links[userChoice]);
  }

  console.log('===== Livro encontrado =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const searchBookInput = async () =>
  inquirer
    .prompt({
      type: 'searchBook',
      name: 'value',
      message: 'Digite o nome de um livro:',
    })
    .then(({ value }) => value);

const showBooksList = async (goBackToBooksMenu, pageLink) => {
  const URL = pageLink || await searchBookInput()
    .then((bookName) => `https://www.anapioficeandfire.com/api/books?name=${bookName}`);

  const { books, links } = await getBooks(URL);

  const choices = createChoicesList(books, links);

  const BOOK_NOT_FOUND = 'Livro não encontrado. Tente novamente.';

  if (!books.length) {
    console.log(BOOK_NOT_FOUND);
    return goBackToBooksMenu();
  }

  const MENU_INSTRUCTIONS = 'Selecione um livro e aperte ENTER para ver mais informações sobre ele:';

  const userChoice = await showMenuOptions({
    message: MENU_INSTRUCTIONS,
    choices,
  });

  await handleUserChoice(userChoice, {
    goBackToBooksMenu,
    showBooksList,
    links,
  });

  return showBooksList(goBackToBooksMenu, URL);
};

module.exports = { run: showBooksList };