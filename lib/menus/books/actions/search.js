const prettyjson = require('prettyjson');
const superagent = require('superagent');
const inquirer = require('inquirer');
const util = require('util');
const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
} = require('../../../utils');

const URL = 'https://www.anapioficeandfire.com/api/books?name=%s&page=1&pageSize=10';

const requestBooks = async (userRequest) =>
  superagent.get(userRequest).then((res) => (
    {
      body: res.body,
      links: parseLinks(res.headers.link),
    }
  ));

const inputUserToSearch = async () =>
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'book',
        message: 'Qual o livro que você deseja ver os dados?',
      }])
    .then(({ book }) => book)
    .then((book) => util.format(URL, book));


const noResultAndBack = async (apiBooks, goBackToCharactersMenu, choices, links) => {
  if (apiBooks.body.length < 1) {
    console.log('=== Nenhum livro encontrado para essa pesquisa. ===');
    return goBackToCharactersMenu();
  }

  const action = await showMenuOptions({
    message: '===== Selecione a ação =====',
    choices: addExtraChoices(choices, links),
  });

  return action === 'back' ? goBackToCharactersMenu() : action;
};

const showBooksMenu = async (goBackToCharactersMenu, pageLink) => {
  const afterURL = pageLink || await inputUserToSearch();
  const apiBooks = await requestBooks(afterURL);
  const { body, links } = apiBooks;
  const choices = body.map((book) => ({
    name: book.name,
    value: book,
  }));

  const results = await noResultAndBack(apiBooks, goBackToCharactersMenu, choices, links);
  const navigate = ['prev', 'next']
    .some((res) => results === res);

  if (navigate) return showBooksMenu(goBackToCharactersMenu, links[results]);

  const toRender = Object.keys(results)
    .map((key) => (
      key !== 'characters'
      && key !== 'povCharacters'
      && { [key]: results[key] }
    ));

  const allKeys = Object.assign({}, ...toRender);

  console.log('======= Livro escolhido ========');
  console.log(prettyjson.render(allKeys));
  console.log('================================');

  return showBooksMenu(goBackToCharactersMenu, afterURL);
};

module.exports = { run: showBooksMenu };
