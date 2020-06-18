const prettyjson = require('prettyjson');
const {
  getDataFromPage,
  addExtraChoices,
  showMenuOptions,
  removeEmptyProperties,
  nextAction,
} = require('../utils');

function removePropertiesFromData(data, remove) {
  let newData = {};

  Object.keys(data)
    .filter((key) => !remove.includes(key))
    .forEach((key) => {
      newData[key] = data[key];
    });

  return removeEmptyProperties(newData);
}

function createChoicesList(data, remove, links) {
  const choices = data.map((data) => ({
    name: data.name || data.aliases[0],
    value: removePropertiesFromData(data, remove),
  }));

  return addExtraChoices(choices, links);
}

async function handleUserChoice(userChoice, { goBackToMenu, showList, links }, dependences) {
  if (userChoice === 'back') return goBackToMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showList(dependences, goBackToMenu, links[userChoice]);
  }

  console.log('================================');
  console.log(prettyjson.render(userChoice));
  console.log('================================');

  return nextAction(showList, dependences, goBackToMenu);
}

async function showList(dependences, goBackToMenu, pageLink) {
  const { name, endpoint, remove, reference } = dependences;

  const { data, links } = await getDataFromPage(
    pageLink || `https://www.anapioficeandfire.com/api/${endpoint}?page=1&pageSize=10`,
  );

  const choices = createChoicesList(data, remove, links);

  const MENU_MAIN_MESSAGE = `'[Listar ${name}] - Escolha ${reference} para ver mais detalhes'`;

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  return handleUserChoice(
    userChoice,
    {
      goBackToMenu,
      showList,
      links,
    },
    dependences,
  );
}

module.exports = { run: showList };
