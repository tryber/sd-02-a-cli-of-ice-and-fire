const {
  getDataFromPage,
  createChoicesList,
  showMenuOptions,
  handleUserChoice,
} = require('../utils');

async function showList(dependences, goBackToMenu, pageLink) {
  const { endpoint, name, remove } = dependences;

  const { data, links } = await getDataFromPage(
    pageLink || `https://www.anapioficeandfire.com/api/${endpoint}?page=1&pageSize=10`,
  );

  const choices = createChoicesList(data, remove, links);

  const MENU_MAIN_MESSAGE = `'[Listar ${name[0]}] - Escolha ${name[2]} para ver mais detalhes'`;

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  return handleUserChoice(
    userChoice,
    {
      goBackToMenu,
      links,
    },
    showList,
    dependences,
  );
}

module.exports = { run: showList };
