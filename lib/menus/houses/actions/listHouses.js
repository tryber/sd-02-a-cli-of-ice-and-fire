/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
const prettyjson = require('prettyjson');
const superagent = require('superagent');
const inquirer = require('inquirer');

const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
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

const MENU_MAIN_MESSAGE = '[Listar Casas] - Escolha um casa para ver mais detalhes';
const SEARCH_API = 'https://anapioficeandfire.com/api/houses?name=';


const removePropertiesFromHouseTitles = ({ swornMembers, ...houseNames }) =>
  removeEmptyProperties(houseNames);

const createChoiceFromHouseTitles = (houseNames) => ({
  /* Uma personagem pode não ter nome. Nesses casos, a API traz a propriedade `alias`,
         que é o que usamos aqui para mostrar a personagem na lista */
  name: houseNames.name || houseNames.aliases[0],
  value: removePropertiesFromHouseTitles(houseNames),
});

const createChoicesList = (houseNames, links) => {
  const choices = houseNames.map(createChoiceFromHouseTitles);
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
const handleUserChoice = (userChoice, { goBackToHousesMenu, showHousesList, links }) => {
  if (userChoice === 'back') return goBackToHousesMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    /* A pessoa pediu para ver a próxima página, ou a página anterior.
       Para realizar isso, chamamos a função que exibe a lista de
       personagens mas passando o link da página escolhida.
     */
    return showHousesList(goBackToHousesMenu, links[userChoice]);
  }

  console.log('===== Livro escolhido =====');
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
 * @param {Function} goBackToHousesMenu Função que exibe o menu de personagens
 * @param {string} pageLink Link da página a ser exibida.
 */

const getHousesFromPage = async (showHousesList, goBackToHousesMenu, pageLink, title) => {
  const actualLink = pageLink || `${SEARCH_API}${title}`;
  const response = await superagent.get(`${actualLink}`);
  const content = response.body;

  if (Object.keys(content).length === 0) {
    console.log('Nenhuma casa encontrada para essa pesquisa');
    return showHousesList(goBackToHousesMenu);
  }

  // const books = content.map((book) => Object.keys(book)
  //   .filter((key) => (key !== 'characters' && key !== 'povCharacters'))
  //   .reduce((obj, prop) => Object.assign(obj, { [prop]: book[prop] }), {}));

  const links = parseLinks(response.headers.link);

  return { content, links };
};

const showHousesList = async (goBackToHousesMenu, pageLink) => {
  let title;
  if (!pageLink) {
    title = await inquirer.prompt(
      {
        type: 'input',
        name: 'bookName',
        message: 'Qual o nome do livro que gostaria de conhecer melhor?',
      },
    ).then(({ bookName }) => bookName);
  }

  const {
    content, links,
  } = await getHousesFromPage(showHousesList, goBackToHousesMenu, pageLink, title);

  const choices = createChoicesList(content, links);

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  await handleUserChoice(userChoice, {
    goBackToHousesMenu,
    showHousesList,
    links,
  });

  const nextAction = await showMenuOptions({
    message: 'O que deseja fazer agora?',
    choices: NEXT_ACTION_CHOICES,
  });

  if (nextAction === 'back') {
    return goBackToHousesMenu();
  }

  if (nextAction === 'repeat') {
    return showHousesList(goBackToHousesMenu);
  }

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { run: showHousesList };