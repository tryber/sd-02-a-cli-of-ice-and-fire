const inquirer = require('inquirer');
const superagent = require('superagent');
const prettyjson = require('prettyjson');

const {
  parseLinks,
  addExtraChoices,
  showMenuOptions,
} = require('../../../utils');

const MENU_MAIN_MESSAGE = '[Procurar Livros] - Digite aqui sua busca';
const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/books?page=1&pageSize=10&name=';

const handleUserChoice = (userChoice, { goBackToBooksMenu, showBooksList, links }) => {
  if (userChoice === 'back') return goBackToBooksMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showBooksList(goBackToBooksMenu, links[userChoice]);
  }

  console.log('===== Personagem escolhida =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

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

const createChoicesList = (books, links) => {
  const choices = books.map(({ name }) => name);
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
  const { booksFoundArray, links } = await typeBookSearch(pageLink || FIRST_PAGE_LINK);

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
