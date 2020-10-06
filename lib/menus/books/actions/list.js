const superagent = require('superagent');
const prettyjson = require('prettyjson');
const {
  showMenuOptions,
  booksNameReceive,
  addExtraChoices,
  parseLinks,
} = require('../../../utils');

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

const handleUserChoice = ({
  books, userChoice, pageLink, urlSearch,
}, { backMenu, receiveNameBook, links }) => {
  if (userChoice === 'back') return backMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return receiveNameBook(backMenu, links[userChoice]);
  }
  console.log('===== Livro escolhida =====');
  console.log(prettyjson.render(
    books.find((ele) => ele.name === userChoice),
  ));
  console.log('================================');
  return receiveNameBook(backMenu, pageLink || urlSearch);
};

const noResults = (choices, backMenu) => {
  if (choices.length === 3) {
    console.log('===== Nenhum Livro Encontrado =====');
    return backMenu();
  }
};

const receiveNameBook = async (backMenu, pageLink) => {
  let response;
  if (!pageLink) response = await booksNameReceive();
  const urlSearch = `https://www.anapioficeandfire.com/api/books?name=${response}&page=1&pageSize=10`;

  const { books, links } = await requestBookName(pageLink || urlSearch);

  const choices = addExtraChoices(books.map(({ name }) => name), links);

  await noResults(choices, backMenu);

  const userChoice = await showMenuOptions(
    { message: 'Escolha o livro para ver detalhes:', choices },
  );

  await handleUserChoice(
    {
      books,
      userChoice,
      pageLink,
      urlSearch,
    },
    {
      backMenu,
      receiveNameBook,
      links,
    },
  );

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { receiveNameBook };
