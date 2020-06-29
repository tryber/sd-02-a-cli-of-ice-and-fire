const prettyjson = require('prettyjson');
const superagent = require('superagent');
const inquirer = require('inquirer');
const util = require('util');
const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const URL = 'https://www.anapioficeandfire.com/api/books?name=%s&page=1&pageSize=10';

const requestBooks = (userRequest) => {
  return new Promise((resolve, reject) => {
    superagent.get(userRequest).end((err, res) => {
      if (err) return reject(err);
      resolve({ body: res.body, links: parseLinks(res.headers.link) });
    });
  });
};

const inputUserToSearch = async () =>
  inquirer
    .prompt(
      [
        {
          type: 'input',
          name: 'book',
          message: 'Qual o livro que você deseja ver os dados?',
        },
      ],
    )
    .then(({ book }) => book);

const showBooksMenu = async (goBackToCharactersMenu) => {
  const bookName = await inputUserToSearch();
  const bookRequest = util.format(URL, bookName);
  const apiBooks = await requestBooks(bookRequest);
  const { body, links } = apiBooks;

  const choices = body.map((book) => ({
    name: book.name,
    value: book,
  }));

  const action = await showMenuOptions({
    message: '======= Livros escolhidos =======',
    choices: addExtraChoices(choices, links),
  });

  if (action === 'back') {
    return goBackToCharactersMenu();
  }

  if (action === 'next') {
    return showBooksMenu(goBackToCharactersMenu);
  }

  const toRender = Object.keys(action)
    .map((key) => {
      if (key !== 'characters' && key !== 'povCharacters') {
        return action[key];
      }
    });

  console.log('===== Personagem escolhida =====');
  console.log(toRender);
  console.log('================================');

};

module.exports = { run: showBooksMenu };
