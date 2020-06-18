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
    /* A pessoa pediu para ver a próxima página, ou a página anterior.
       Para realizar isso, chamamos a função que exibe a lista de
       livros mas passando o link da página escolhida.
     */
    return showBooksList(goBackToBooksMenu, links[userChoice]);
  }

  console.log('===== livro escolhido =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const showBooksList = async (goBackToBooksMenu, pageLink) => {
  let bookInput;

  if (!pageLink) bookInput = await inputBookName();

  const url = `https://www.anapioficeandfire.com/api/books?name=${bookInput}`;
  const { books, links } = await getBooksFromPage(pageLink || url || FIRST_PAGE_LINK);

  const choices = createChoicesList(books, links);

  const userChoice = await showMenuOptions({ message: MENU_MAIN_MESSAGE, choices });

  await handleUserChoice(userChoice, { goBackToBooksMenu, showBooksList, links });

  const nextAction = await showMenuOptions(
    { message: 'O que deseja fazer agora?', choices: NEXT_ACTION_CHOICES },
  );

  if (nextAction === 'back') return goBackToBooksMenu();

  if (nextAction === 'repeat') return showBooksList(goBackToBooksMenu);

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { run: showBooksList };
