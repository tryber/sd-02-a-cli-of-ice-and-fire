const prettyjson = require('prettyjson');
const superagent = require('superagent');

const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10';

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

const MENU_MAIN_MESSAGE = '[Listar Casas] - Escolha uma casa para ver mais detalhes';

const getHousesFromPage = (pageLink) =>
  new Promise((resolve, reject) => {
    superagent.get(pageLink).end((err, response) => {
      if (err) return reject(err);

      const houses = response.body;
      /* A documentação da API especifica que ela retorna um header chamado link,
         que contém o link para a próxima página ou para a página anterior, se existir. */
      const links = parseLinks(response.headers.link);

      return resolve({ houses, links });
    });
  });

const removePropertiesFromHouse = ({ swornMembers, ...house }) =>
  removeEmptyProperties(house);

const createChoiceFromHouse = (house) => ({
  name: house.name,
  value: removePropertiesFromHouse(house),
});

const createChoicesList = (houses, links) => {
  const choices = houses.map(createChoiceFromHouse);
  return addExtraChoices(choices, links);
};

const handleUserChoice = (userChoice, { goBackToHousesMenu, showHousesList, links }) => {
  if (userChoice === 'back') return goBackToHousesMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    /* A pessoa pediu para ver a próxima página, ou a página anterior.
       Para realizar isso, chamamos a função que exibe a lista de
       casas mas passando o link da página escolhida.
     */
    return showHousesList(goBackToHousesMenu, links[userChoice]);
  }

  console.log('===== Casa escolhida =====');
  /* `prettyjson` é um módulo que formata o JSON
      para que ele seja exibido de forma "bonitinha" no terminal */
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const showHousesList = async (goBackToHousesMenu, pageLink) => {
  const { houses, links } = await getHousesFromPage(pageLink || FIRST_PAGE_LINK);

  const choices = createChoicesList(houses, links);

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
