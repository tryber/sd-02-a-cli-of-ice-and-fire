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

const requestBooks = (userRequest) =>
  new Promise((resolve, reject) => {
    superagent.get(userRequest).end((err, res) => {
      if (err) return reject(err);
      resolve({ body: res.body, links: parseLinks(res.headers.link) });
    });
  });

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


const chooseOption = () => {

}

const showBooksMenu = async (goBackToCharactersMenu, pageLink) => {
  const afterURL = pageLink || await inputUserToSearch();
  const apiBooks = await requestBooks(afterURL);
  const { body, links } = apiBooks;
  const choices = body.map((book) => ({
    name: book.name,
    value: book,
  }));

  if (apiBooks.body.length < 1) {
    console.log('=== Nenhum livro encontrado para essa pesquisa. ===');
    return goBackToCharactersMenu();
  }

  const action = await showMenuOptions({
    message: '===== Selecione a ação =====',
    choices: addExtraChoices(choices, links),
  });

  switch (action) {
    case 'back':
      return goBackToCharactersMenu();
    case 'prev':
      return showBooksMenu(goBackToCharactersMenu, links[action]);
    case 'next':
      return showBooksMenu(goBackToCharactersMenu, links[action]);
    default: break;
  }

  // if (action === 'back') {
  //   return goBackToCharactersMenu();
  // }

  // if (action === 'prev' || action === 'next') {
  //   return showBooksMenu(goBackToCharactersMenu, links[action]);
  // }

  const toRender = Object.keys(action)
    .map((key) => (
      key !== 'characters'
      && key !== 'povCharacters'
      && { [key]: action[key] }
    ));

  const allKeys = Object.assign({}, ...toRender);

  console.log('======= Livro escolhido ========');
  console.log(prettyjson.render(allKeys));
  console.log('================================');

  return showBooksMenu(goBackToCharactersMenu, afterURL);
};

const decision = () => {

};

module.exports = { run: showBooksMenu };
