const prettyjson = require('prettyjson');
const superagent = require('superagent');

const {
  parseLinks, showMenuOptions, addExtraChoices, removeEmptyProperties,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10';

const NEXT_ACTION_CHOICES = [
  { name: 'Voltar para o menu de casas', value: 'back' },
  { name: 'Exibir outra casa', value: 'repeat' },
  { name: 'Sair', value: 'exit' },
];

const MENU_MAIN_MESSAGE = '[Listar Personagens] - Escolha uma casa para ver mais detalhes';

const getHousesFromPage = (pageLink) => (
  new Promise((resolve, reject) => {
    superagent.get(pageLink).then((response) => {
      const houses = response.body;
      const links = parseLinks(response.headers.link);
      return resolve({ houses, links });
    }).catch((err) => reject(err));
  })
);

const removePropertiesFromCharacter = ({ swornMembers, ...house }) =>
  removeEmptyProperties(house);

const createChoiceFromCharacter = (house) => (
  { name: house.name || house.aliases[0], value: removePropertiesFromCharacter(house) }
);

const createChoicesList = (houses, links) => {
  const choices = houses.map(createChoiceFromCharacter);
  return addExtraChoices(choices, links);
};

const handleUserChoice = (userChoice, { goBackToHousesMenu, showHousesList, links }) => {
  if (userChoice === 'back') return goBackToHousesMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showHousesList(goBackToHousesMenu, links[userChoice]);
  }

  console.log('===== Personagem escolhida =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};


const showHousesList = async (goBackToHousesMenu, pageLink) => {
  const { houses, links } = await getHousesFromPage(pageLink || FIRST_PAGE_LINK);

  const choices = createChoicesList(houses, links);

  const userChoice = await showMenuOptions({ message: MENU_MAIN_MESSAGE, choices });

  await handleUserChoice(userChoice, { goBackToHousesMenu, showHousesList, links });

  const nextAction = await showMenuOptions(
    { message: 'O que deseja fazer agora?', choices: NEXT_ACTION_CHOICES },
  );

  if (nextAction === 'back') return goBackToHousesMenu();

  if (nextAction === 'repeat') return showHousesList(goBackToHousesMenu);

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { run: showHousesList };
