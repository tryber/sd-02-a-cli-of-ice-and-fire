const prettyjson = require('prettyjson');
const superagent = require('superagent');

const {
  parseLinks,
  showMenuInsert,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/books?page=1&pageSize=10';

const BASE_FILTER_LINK = 'https://www.anapioficeandfire.com/api/books?name=';

const SEARCH_MESSAGE = '[Buscar Livros] - Digite um livro para busca';

const MENU_MAIN_MESSAGE = '[Pesquisar Livros] - Escolha um livro para ver mais detalhes';

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

const getBooksFromPage = async (searchLink) =>
  new Promise(async (resolve, reject) => {
    await superagent.get(searchLink)
      .then((response) => {
        const books = response.body;

        const links = parseLinks(response.headers.link);

        return resolve({ books, links });
      })
      .catch((err) => reject(err));
  });

const removePropertiesFromBook = ({ characters, povCharacters, ...book }) =>
  removeEmptyProperties(book);

const createChoiceFromBook = (books) => ({
  name: books.name || books.aliases[0],
  value: removePropertiesFromBook(books),
});

const createChoicesList = (books, links) => {
  const choices = books.map(createChoiceFromBook);
  return addExtraChoices(choices, links);
};

const handleUserChoice = (userChoice, { goBackToBooksMenu, showBooksSearch, links }) => {
  if (userChoice === 'back') return goBackToBooksMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showBooksSearch(goBackToBooksMenu, links[userChoice]);
  }

  console.log('===== Livro escolhido =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const showBooksSearch = async (goBackToBooksMenu, pageLink) => {
  let booksPage;

  if (!pageLink) {
    const { name } = await showMenuInsert({
      message: SEARCH_MESSAGE,
    });

    let searchLink;

    if (name === '') {
      searchLink = FIRST_PAGE_LINK;
    } else {
      searchLink = BASE_FILTER_LINK + name;
    }

    booksPage = await getBooksFromPage(searchLink);
  } else {
    booksPage = await getBooksFromPage(pageLink);
  }

  const { books, links } = booksPage;

  if (books.length !== 0) {
    const choices = createChoicesList(books, links);

    const userChoice = await showMenuOptions({
      message: MENU_MAIN_MESSAGE,
      choices,
    });

    handleUserChoice(userChoice, {
      goBackToBooksMenu,
      showBooksSearch,
      links,
    });
  } else {
    console.log("Nenhum livro encontrado para essa pesquisa");
  }

  const nextAction = await showMenuOptions({
    message: 'O que deseja fazer agora?',
    choices: NEXT_ACTION_CHOICES,
  });

  if (nextAction === 'back') {
    return goBackToBooksMenu();
  }

  if (nextAction === 'repeat') {
    return showBooksSearch(goBackToBooksMenu);
  }

  return console.log('OK, até logo!');
};

module.exports = { run: showBooksSearch };
