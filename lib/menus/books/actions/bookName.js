const prettyjson = require('prettyjson');
const superagent = require('superagent');
const inquirer = require('inquirer');

const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10';

const NEXT_ACTION_CHOICES = [
  {
    name: 'Voltar para busca de livros',
    value: 'back',
  },
  {
    name: 'Sair',
    value: 'exit',
  },
];

const questions = [
  {
    type: 'input',
    name: 'book',
    message: 'Digite o nome do livro corretamente: ',
  },
];

const MENU_MAIN_MESSAGE = 'Escolha o livro desejado:';

const getBookFromPage = async (pageLink) => {
  try {
    const res = await superagent.get(pageLink);
    const { body: books, headers: { link: links } } = res;
    return { books, links: parseLinks(links) };
  } catch (err) {
    console.error(err);
  }
};

const removePropertiesFromCharacter = ({ characters, povCharacters, ...books }) =>
  removeEmptyProperties(books);

const createChoiceFromName = (book) => ({
  /* Uma personagem pode não ter nome. Nesses casos, a API traz a propriedade `alias`,
         que é o que usamos aqui para mostrar a personagem na lista */
  name: book.name,
  value: removePropertiesFromCharacter(book),
});

const createChoicesList = (books, links) => {
  const choices = books.map(createChoiceFromName);
  return addExtraChoices(choices, links);
};

/**
 * Recebe uma escolha realizada pelo usuário.
 * Essa escolha pode ser uma personagem, que será exibida na tela,
 * ou o nome de uma ação a ser realizada, como voltar para o menu anterior.
 * O segundo parâmetro recebe as funções responsáveis por exibir
 * uma página de personagens, e por voltar para o menu principal.
 * O segundo parâmetro também recebe os links para a próxima página anterior.
 * @param {string} userChoice Opção escolhida pela pessoa
 * @param {object} dependencies Funções e parâmetros necessários para controle de fluxo
 */
const handleUserChoice = (userChoice, { goBackToBooksMenu, showBook, links }) => {
  if (userChoice === 'back') return goBackToBooksMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    /* A pessoa pediu para ver a próxima página, ou a página anterior.
       Para realizar isso, chamamos a função que exibe a lista de
       personagens mas passando o link da página escolhida.
     */
    return showBook(goBackToBooksMenu, links[userChoice]);
  }

  console.log('===== Menu de Livros =====');
  /* `prettyjson` é um módulo que formata o JSON
      para que ele seja exibido de forma "bonitinha" no terminal */
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

/**
 * Exibe o menu da ação de listar personagens.
 * Na primeia execução, o parâmetro `pageLink` estará vazio,
 * o que fará com que a função `getCharactersFromPage` busque a primeira página.
 * Quando a pessoa escolher ver a próxima página, chamamos `listCharacters`
 * passando o link dessa próxima página.
 * @param {Function} goBackToBooksMenu Função que exibe o menu de personagens
 * @param {string} pageLink Link da página a ser exibida.
 */

const callBookName = () => inquirer.prompt(questions).then((answer) => answer.book);

const showBook = async (goBackToBooksMenu, pageLink) => {
  const bookLink = pageLink
  || await callBookName()
    .then((bookName) => `https://www.anapioficeandfire.com/api/books?name=${bookName}`);

  const res = await getBookFromPage(bookLink || FIRST_PAGE_LINK);
  const { books, links } = res;
  if (books.length === 0) {
    console.log('Nenhum livro encontrado para essa pesquisa');
    return goBackToBooksMenu();
  }
  const choices = createChoicesList(books, links);
  const userChoice = await showMenuOptions({ message: MENU_MAIN_MESSAGE, choices });

  await handleUserChoice(userChoice, { goBackToBooksMenu, showBook, links });

  return showBook(goBackToBooksMenu, bookLink);
};

module.exports = { run: showBook };
