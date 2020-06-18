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
const { type } = require('os');

const URL = 'https://www.anapioficeandfire.com/api/books?name=%s&page=%d&pageSize=10';

const requestBooks = (userRequest) => {
  return new Promise((resolve, reject) => {
    superagent.get(userRequest).end((err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

const NEXT_CHOICES = [
  {
    name: 'Escolher outro livro',
    value: 'repeat',
  },
  {
    name: 'Voltar para o menu principal',
    value: 'back',
  },
  {
    name: 'Sair',
    value: 'exit',
  },
];

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

// console.log('======= Livros escolhidos =======');
// console.log('=================================');

const showBooksMenu = async (pageNumber) => {
  const bookName = await inputUserToSearch();
  const bookRequest = util.format(URL, bookName, pageNumber);
  const apiBooks = await requestBooks(bookRequest);
  const bookListApi = apiBooks.body;

  const action = showMenuOptions({
    message: '======= Livros escolhidos =======',
    choices: [
      ...bookListApi.map((book) => ({
        name: book.name,
        value: book,
      })),
    ],
  });
};

module.exports = { run: showBooksMenu };
