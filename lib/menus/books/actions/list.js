const superagent = require('superagent');
const prettyjson = require('prettyjson');
const {
  showMenuOptions,
  booksNameReceive,
  addExtraChoices,
  parseLinks,
} = require('../../../utils');

const NEXT_ACTION_CHOICES = [
  {
    name: 'Voltar para o menu de livros',
    value: 'back',
  },
  {
    name: 'Exibir outro livro',
    value: 'repeat',
  },
  {
    name: 'Sair',
    value: 'exit',
  },
];

const requestBookName = (api) =>
  new Promise((resolve, reject) => {
    superagent.get(api)
      .then((response) => {
        const books = response.body;
        const links = parseLinks(response.headers.link);
        books.forEach((element, index) => {
          delete books[index].characters;
          delete books[index].povCharacters;
        });
        return resolve({
          books,
          links,
        });
      })
      .catch((err) => reject(err));
  });

const handleUserChoice = ({ books, userChoice }, { backMenu, receiveNameBook, links }) => {
  if (userChoice === 'back') return backMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return receiveNameBook(backMenu, links[userChoice]);
  }
  console.log('===== Livro escolhida =====');
  console.log(prettyjson.render(
    books.find((ele) => ele.name === userChoice),
  ));
  console.log('================================');
};

const receiveNameBook = async (backMenu, pageLink) => {
  let response;
  if (!pageLink) response = await booksNameReceive();
  const { books, links } = await requestBookName(pageLink || `https://www.anapioficeandfire.com/api/books?name=${response}&page=1&pageSize=10`);
  const choices = addExtraChoices(books.map(({ name }) => name), links);

  if (choices.length === 3) {
    console.log('===== Nenhum Livro Encontrado =====');
    return backMenu();
  }

  const userChoice = await showMenuOptions(
    {
      message: 'Escolha o livro para ver detalhes:',
      choices,
    },
  );

  await handleUserChoice({ books, userChoice }, {
    backMenu,
    receiveNameBook,
    links,
  });

  const nextAction = await showMenuOptions({
    message: 'O que deseja fazer agora?',
    choices: NEXT_ACTION_CHOICES,
  });

  if (nextAction === 'back') {
    return backMenu();
  }

  if (nextAction === 'repeat') {
    return receiveNameBook(backMenu);
  }

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { receiveNameBook };
