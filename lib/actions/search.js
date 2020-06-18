const {
  getDataFromPage,
  createChoicesList,
  showMenuOptions,
  handleUserChoice,
  showMenuInsert,
} = require('../utils');

function getLink(name, endpoint) {
  if (name === '') return `https://www.anapioficeandfire.com/api/${endpoint}?page=1&pageSize=10`;
  return `https://www.anapioficeandfire.com/api/${endpoint}?name=${name}`;
}

async function showSearch(dependences, goBackToMenu, pageLink) {
  const { endpoint, name: pageName, remove } = dependences;
  let dataFromPage;

  if (pageLink) {
    dataFromPage = await getDataFromPage(pageLink);
  } else {
    const SEARCH_MESSAGE = `[Buscar ${pageName[0]}] - Digite ${pageName[1]} para busca`;

    const { name } = await showMenuInsert({ message: SEARCH_MESSAGE });

    dataFromPage = await getDataFromPage(getLink(name, endpoint));
  }

  const { data, links } = dataFromPage;

  if (data.length === 0) {
    return handleUserChoice('empty', { goBackToMenu, links }, showSearch, dependences,);
  }

  const choices = createChoicesList(data, remove, links);

  const MENU_MAIN_MESSAGE = `'[Pesquisar ${pageName[0]}] - Escolha ${pageName[1]} para ver mais detalhes'`;

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  return handleUserChoice(userChoice, { goBackToMenu, links }, showSearch, dependences);
}

module.exports = { run: showSearch };

