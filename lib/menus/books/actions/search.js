const inquirer = require('inquirer');
const prettyjson = require('prettyjson');
const superagent = require('superagent');

const {
  parseLinks, showMenuOptions, addExtraChoices, removeEmptyProperties,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/books?page=1&pageSize=10';

const NEXT_ACTION_CHOICES = [
  { name: 'Voltar para o menu de livros', value: 'back' },
  { name: 'Exibir outro livro', value: 'repeat' },
  { name: 'Sair', value: 'exit' },
];

const MENU_MAIN_MESSAGE = '[Listar livros] - Escolha um livro para ver mais detalhes';

const inputBookName = async () => (
  inquirer.prompt(
    { type: 'input', name: 'bookName', message: 'Digite o nome do livro: ' },
  ).then(({ bookName }) => bookName)
);

const getBooksFromPage = (bookInput) => (
  new Promise((resolve, reject) => {
    superagent.get(bookInput).then((response) => {
      const books = response.body;
      const links = parseLinks(response.headers.link);
      return resolve({ books, links });
    })
      .catch((err) => reject(err));
  })
);

const removePropertiesFromBooks = ({ characters, povCharacters, ...book }) =>
  removeEmptyProperties(book);

const createChoiceFromBooks = (book) => ({
  name: book.name,
  value: removePropertiesFromBooks(book),
});

const createChoicesList = (books, links) => {
  const choices = books.map(createChoiceFromBooks);
  return addExtraChoices(choices, links);
};

const handleUserChoice = (userChoice, { goBackToBooksMenu, showBooksList, links }) => {
  if (userChoice === 'back') return goBackToBooksMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showBooksList(goBackToBooksMenu, links[userChoice]);
  }

  console.log('===== livro escolhido =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const showBooksList = async (goBackToBooksMenu, pageLink) => {
  let bookInput = '';
  if (!pageLink) bookInput = await inputBookName();
  const urlName = `https://www.anapioficeandfire.com/api/books?name=${bookInput}`;
  const url = pageLink || urlName;
  const { books, links } = await getBooksFromPage(url);
  if (books.length === 0) {
    console.log('Nenhum livro encontrado para essa pesquisa');
    return goBackToBooksMenu();
  }
  const choices = createChoicesList(books, links);
  const userChoice = await showMenuOptions({ message: MENU_MAIN_MESSAGE, choices });
  await handleUserChoice(userChoice, { goBackToBooksMenu, showBooksList, links });
  return showBooksList(goBackToBooksMenu, url);
};

module.exports = { run: showBooksList };
