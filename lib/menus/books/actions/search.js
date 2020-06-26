const prettyjson = require('prettyjson');
const superagent = require('superagent');

const {
  parseLinks,
  showMenuOptions,
  showSearchQuestion,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const NAME_SEARCH_LINK = 'https://www.anapioficeandfire.com/api/books?name=';

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/books?page=1&pageSize=10&name=';

const QUESTION_MESSAGE = 'Insira o nome do livro que deseja pesquisar:';

const MENU_MAIN_MESSAGE = '[Listar Livros] - Escolha um livro para ver mais detalhes';

const getBooksFromPage = (pageLink) => (
  superagent.get(pageLink)
  .then((response) => {
    const books = response.body;
    const links = parseLinks(response.headers.link);
    return { books, links };
  })
  .catch((err) => console.error(err))
);

const removePropertiesFromBook = ({ characters, povCharacters, ...book }) =>
  removeEmptyProperties(book);

const createChoiceFromBook = (book) => ({
  name: book.name,
  value: removePropertiesFromBook(book),
});

const createChoicesList = (books, links) => {
  const choices = books.map(createChoiceFromBook);
  return addExtraChoices(choices, links);
};

const handleUserChoice = (
  userChoice,
  { goBackToBooksMenu, showBooksList, links, REQUEST_LINK },
) => {
  if (userChoice === 'back') return goBackToBooksMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    /* A pessoa pediu para ver a próxima página, ou a página anterior.
       Para realizar isso, chamamos a função que exibe a lista de
       livros mas passando o link da página escolhida.
     */
    return showBooksList(goBackToBooksMenu, links[userChoice]);
  }

  console.log('===== Livro selecionado =====');
  /* `prettyjson` é um módulo que formata o JSON
      para que ele seja exibido de forma "bonitinha" no terminal */
  console.log(prettyjson.render(userChoice));
  console.log('================================');

  showBooksList(goBackToBooksMenu, REQUEST_LINK);
};

const showBooksList = async (goBackToBooksMenu, pageLink) => {
  let REQUEST_LINK;

  if (pageLink) {
    REQUEST_LINK = pageLink;
  } else {
    const bookSearch = await showSearchQuestion({
      message: QUESTION_MESSAGE,
    });
    REQUEST_LINK = bookSearch ? `${NAME_SEARCH_LINK}${bookSearch}` : FIRST_PAGE_LINK;
  }

  const { books, links } = await getBooksFromPage(REQUEST_LINK);

  if (books.length === 0) {
    console.log('Nenhum livro encontrado para essa pesquisa');
    return goBackToBooksMenu();
  }

  const choices = createChoicesList(books, links);

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  await handleUserChoice(userChoice, {
    goBackToBooksMenu,
    showBooksList,
    links,
    REQUEST_LINK,
  });
};

module.exports = { run: showBooksList };
