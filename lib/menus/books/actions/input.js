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
    name: 'Voltar para o menu de livros',
    value: 'back',
  },
  {
    name: 'Pesquisar outro livro',
    value: 'repeat',
  },
  {
    name: 'Sair',
    value: 'exit',
  },
];

const MENU_MAIN_MESSAGE = 'Digite um livro para ver mais detalhes:';

const getBooks = (URL) =>
  superagent.get(URL)
    .then(({ headers, body }) => {
      const books = body;
      const links = parseLinks(headers.link);
      return { books, links };
    })
    .catch((err) => console.error(err));

const removePropertiesFromCharacter = ({ characters, povCharacters, ...book }) =>
  removeEmptyProperties(book);

const showBookDetails = (book) => ({
  name: book.name,
  value: removePropertiesFromCharacter(book),
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
  if (!userChoice) return console.log('livro não encontrado');

  console.log('===== Livro encontrado =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const searchBookInput = async () =>
  inquirer
    .prompt({
      type: 'input',
      name: 'value',
      message: 'Digite o nome de um livro:',
    })
    .then(({ value }) => value);

const showBooksList = async (goBackToBooksMenu, pageLink) => {
  const URL = pageLink || await searchBookInput()
    .then((bookName) => `https://www.anapioficeandfire.com/api/books?name=${bookName}`);
  const { books, links } = await getBooks(URL);

  const choices = createChoicesList(books, links);

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
