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

const render = (userChoice) => {
  console.log('======== Livro escolhido =======');
  console.log(prettyjson.render(takeAwayCharecters(userChoice)));
  console.log('================================');
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
  } else {
    return getBooksFromPage(redlinks);
  }
};

const secoundBlock = (books, links) => {
  if (books.length > 0) {
    const choices = createChoicesList(books, links);
    return showMenuOptions({ message: MENU_MAIN_MESSAGE, choices });
  }
  return showMenuOptions({ message: NO_BOOK_FOUND, choices: NO_BOOK_CHOICES });
};

const pesquisar = async (goBackToBooksMenu, redlinks) => {
  const { links, books } = await firstBlock(redlinks);
  const userChoice = await secoundBlock(books, links);

  if (userChoice === 'next' || userChoice === 'prev') {
    return pesquisar(goBackToBooksMenu, links[userChoice]);
  }
  if (userChoice === 'back') { return goBackToBooksMenu(); }
  render(userChoice);

  const nextAction = await showMenuOptions({
    message: 'O que deseja fazer agora?',
    choices: NEXT_ACTION_CHOICES,
  });

  if (nextAction === 'back') {
    return goBackToBooksMenu();
  }

  if (nextAction === 'repeat') {
    return pesquisar(goBackToBooksMenu);
  }
};


module.exports = { run: pesquisar };
