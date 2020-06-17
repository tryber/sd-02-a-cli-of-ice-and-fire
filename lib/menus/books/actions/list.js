const inquirer = require('inquirer');
const superagent = require('superagent');

const MENU_MAIN_MESSAGE = '[Procurar Livros] - Digite aqui sua busca';
const API_ENDPOINT = 'https://www.anapioficeandfire.com/api/books?page=1&pageSize=10&name=';

const getBook = async (search) => {
  try {
    const res = await superagent.get(`${API_ENDPOINT}${search}`);
    const booksFoundArray = res.body;
    if (booksFoundArray.length) {
      booksFoundArray.forEach(({ name }) => {
        console.log(name);
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const typeBookSearch = async () =>
  inquirer
    .prompt({
      type: 'input',
      name: 'inputBook',
      message: MENU_MAIN_MESSAGE,
    })
    .then(({ inputBook }) => {
      getBook(inputBook);
    });

module.exports = { run: typeBookSearch };
