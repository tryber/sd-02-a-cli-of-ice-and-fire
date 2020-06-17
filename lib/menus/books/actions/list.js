const superagent = require('superagent');
const {
  showMenuOptions,
  booksNameReceive,
  addExtraChoices,
  parseLinks,
} = require('../../../utils');

const requestBookDetails = (link) => (
  new Promise((resolve, reject) => {
    superagent.get(link)
      .then((response) => {
        return resolve(response.body);
      })
      .catch((err) => reject(err));
  })
);

const requestBookName = (api) =>
  new Promise((resolve, reject) => {
    superagent.get(api)
      .then((response) => {
        const books = response.body;
        const links = parseLinks(response.headers.link);
        return resolve({
          books: books.map(({ url, name }) => ({ name, url })),
          links,
        });
      })
      .catch((err) => reject(err));
  });

  const handleUserChoice = (userChoice, { goBackToCharactersMenu, showCharactersList, links }) => {
    if (userChoice === 'back') return goBackToCharactersMenu();
    if (userChoice === 'next' || userChoice === 'prev') {
      /* A pessoa pediu para ver a próxima página, ou a página anterior.
         Para realizar isso, chamamos a função que exibe a lista de
         personagens mas passando o link da página escolhida.
       */
      return showCharactersList(goBackToCharactersMenu, links[userChoice]);
    }
// A Game of Thrones
const receiveNameBook = async () => {
  const response = await booksNameReceive();
  const { books, links } = await requestBookName(`https://www.anapioficeandfire.com/api/books?name=${response}&page=1&pageSize=10`);
  const choices = addExtraChoices(books.map(({ name }) => name), links);
  const selected = await showMenuOptions(
    {
      message: 'Escolha o livro para ver detalhes:',
      choices,
    },
  );
};

module.exports = { receiveNameBook };
