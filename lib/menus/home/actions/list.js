const prettyjson = require('prettyjson');
const superagent = require('superagent');

const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://anapioficeandfire.com/api/houses?page=1&pageSize=10';

const NEXT_ACTION_CHOICES = [
  {
    name: 'Voltar para o menu de casas',
    value: 'back',
  },
  {
    name: 'Exibir outra casa',
    value: 'repeat',
  },
  {
    name: 'Sair',
    value: 'exit',
  },
];

const MENU_MAIN_MESSAGE = '[Listar casas] - Escolha uma casa para ver mais detalhes';

const getHomesFromPage = (pageLink) =>
  new Promise((resolve, reject) => {
    superagent.get(pageLink)
      .then((response) => {
        const homes = response.body;
        const links = parseLinks(response.headers.link);

        return resolve({ homes, links });
      })
      .catch((err) => reject(err));
  });

const removePropertiesFromHome = ({ swornMembers, ...home }) =>
  removeEmptyProperties(home);

const createChoiceFromhome = (home) => ({
  name: home.name || home.aliases[0],
  value: removePropertiesFromHome(home),
});

const createChoicesList = (homes, links) => {
  const choices = homes.map(createChoiceFromhome);
  return addExtraChoices(choices, links);
};

const handleUserChoice = (userChoice, { goBackToHomeMenu, showHomeList, links }) => {
  if (userChoice === 'back') return goBackToHomeMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showHomeList(goBackToHomeMenu, links[userChoice]);
  }

  console.log('===== Casa escolhida =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const showHomeList = async (goBackToHomeMenu, pageLink) => {
  const { homes, links } = await getHomesFromPage(pageLink || FIRST_PAGE_LINK);

  const choices = createChoicesList(homes, links);

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  await handleUserChoice(userChoice, {
    goBackToHomeMenu,
    showHomeList,
    links,
  });

  const nextAction = await showMenuOptions({
    message: 'O que deseja fazer agora?',
    choices: NEXT_ACTION_CHOICES,
  });

  if (nextAction === 'back') {
    return goBackToHomeMenu();
  }

  if (nextAction === 'repeat') {
    return showHomeList(goBackToHomeMenu);
  }

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { run: showHomeList };
