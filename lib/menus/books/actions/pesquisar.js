const superagent = require('superagent');
const readline = require('readline');
const prettyjson = require('prettyjson');

const {
  showMenuOptions,
  parseLinks,
  addExtraChoices,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/books?page=1&pageSize=10';
const MENU_MAIN_MESSAGE = '[Listar Livros] - Escolha um livro para ver mais detalhes';

const NO_BOOK_FOUND = 'Nenhum livro encontrado para essa pesquisa';
const NO_BOOK_CHOICES = [
  { name: 'Voltar para o menu de livros', value: 'back' },
];


function question(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const takeAwayCharecters = (book) => {
  const { characters, povCharacters, ...cleanObj } = book;
  return cleanObj;
};

const render = (userChoice, thirdBlockFixed) => {
  console.log('======== Livro escolhido =======');
  console.log(prettyjson.render(takeAwayCharecters(userChoice)));
  console.log('================================');
  return thirdBlockFixed(thirdBlockFixed);
};

const getBooksFromPage = (pageLink) =>
  new Promise((resolve, _reject) => {
    superagent.get(pageLink)
      .then((response) => {
        const books = response.body;

        const links = parseLinks(response.headers.link);
        return resolve({ books, links });
      })
      .catch(console.error);
  });

const createChoiceFromBooks = (books) => ({
  name: books.name,
  value: books,
});

const createChoicesList = (books, links) => {
  const choices = books.map(createChoiceFromBooks);
  return addExtraChoices(choices, links);
};

const firstBlock = async (redlinks) => {
  if (!redlinks) {
    const answer = await question('Digite o nome do livro: ');
    return (answer) ?
      getBooksFromPage(`${FIRST_PAGE_LINK}&name=${answer}`) :
      getBooksFromPage(`${FIRST_PAGE_LINK}`);
  }
  return getBooksFromPage(redlinks);
};

const secoundBlock = (books, links, goBackToBooksMenu) => {
  if (books.length > 0) {
    const choices = createChoicesList(books, links);
    return showMenuOptions({ message: MENU_MAIN_MESSAGE, choices });
  }
  console.log('Nenhum livro encontrado para essa pesquisa');
  return goBackToBooksMenu();
};

const thirdBlock = (books, links, goBackToBooksMenu, pesquisar) => async (thirdBlockFixed) => {
  const userChoice = await secoundBlock(books, links, goBackToBooksMenu);

  await handleUserChoice(userChoice, links, goBackToBooksMenu, pesquisar, thirdBlockFixed);
};

const handleUserChoice = (userChoice, links, goBackToBooksMenu, pesquisar, thirdBlockFixed) => {
  if (userChoice === 'next' || userChoice === 'prev') {
    return pesquisar(goBackToBooksMenu, links[userChoice]);
  }
  if (userChoice === 'back') { return goBackToBooksMenu(); }
  render(userChoice, thirdBlockFixed);
};

const pesquisar = async (goBackToBooksMenu, redlinks) => {
  const { links, books } = await firstBlock(redlinks);

  const thirdBlockFixed = thirdBlock(books, links, goBackToBooksMenu, pesquisar);

  await thirdBlockFixed(thirdBlockFixed);
};


module.exports = { run: pesquisar };
