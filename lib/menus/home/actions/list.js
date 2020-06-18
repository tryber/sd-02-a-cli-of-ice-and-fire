const prettyjson = require('prettyjson');
const superagent = require('superagent');

const {
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
} = require('../../../utils');

const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10';

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

const getCharactersFromPage = (pageLink) =>
  new Promise((resolve, reject) => {
    superagent.get(pageLink)
      .then((response) => {
        const characters = response.body;
        const links = parseLinks(response.headers.link);

        return resolve({ characters, links });
      })
      .catch((err) => reject(err));
  });

const removePropertiesFromCharacter = ({ books, povBooks, ...character }) =>
  removeEmptyProperties(character);

const createChoiceFromCharacter = (character) => ({
  name: character.name || character.aliases[0],
  value: removePropertiesFromCharacter(character),
});

const createChoicesList = (characters, links) => {
  const choices = characters.map(createChoiceFromCharacter);
  return addExtraChoices(choices, links);
};

const handleUserChoice = (userChoice, { goBackToHomeMenu, showCharactersList, links }) => {
  if (userChoice === 'back') return goBackToHomeMenu();
  if (userChoice === 'next' || userChoice === 'prev') {
    return showCharactersList(goBackToHomeMenu, links[userChoice]);
  }

  console.log('===== Personagem escolhida =====');
  console.log(prettyjson.render(userChoice));
  console.log('================================');
};

const showCharactersList = async (goBackToHomeMenu, pageLink) => {
  const { characters, links } = await getCharactersFromPage(pageLink || FIRST_PAGE_LINK);

  const choices = createChoicesList(characters, links);

  const userChoice = await showMenuOptions({
    message: MENU_MAIN_MESSAGE,
    choices,
  });

  await handleUserChoice(userChoice, {
    goBackToHomeMenu,
    showCharactersList,
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
    return showCharactersList(goBackToHomeMenu);
  }

  console.log('OK, até logo!');
  process.exit(0);
};

module.exports = { run: showCharactersList };
