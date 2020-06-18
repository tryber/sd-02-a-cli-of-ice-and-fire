const inquirer = require('inquirer');
const superagent = require('superagent');

const addExtraChoices = (choices, links) => {
  const newChoices = [...choices];

  newChoices.push(new inquirer.Separator());

  if (links.next) {
    newChoices.push({ name: 'Próxima página', value: 'next' });
  }

  if (links.prev) {
    newChoices.push({ name: 'Página anterior', value: 'prev' });
  }

  newChoices.push({
    name: 'Voltar para o menu anterior',
    value: 'back',
  });

  newChoices.push(new inquirer.Separator());

  return newChoices;
};

function parseLinks(links) {
  return Object.fromEntries(
    links
      .split(',')
      .map((link) => link.split(';'))
      .map((linkPairs) => linkPairs.map((part) => part.trim()))
      .map(([link, rel]) => [rel.replace(/(?:rel)|"|=/gi, ''), link.replace(/<|>/g, '')])
      .filter(([rel]) => rel !== 'first' && rel !== 'last'),
  );
}

const getDataFromPage = async (pageLink) =>
  new Promise(async (resolve, reject) => {
    await superagent
      .get(pageLink)
      .then((response) => {
        const data = response.body;

        const links = parseLinks(response.headers.link);

        return resolve({ data, links });
      })
      .catch((err) => reject(err));
  });

const isEmpty = (value) => {
  if (Array.isArray(value)) {
    if (value.length <= 0) return true;
    const arrayWithNoEmpties = value.filter((v) => !isEmpty(v));
    if (arrayWithNoEmpties.length <= 0) return true;
    return false;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  if (value === undefined || value === null) return true;

  return !value;
};

const NEXT_ACTION_CHOICES = (name) => [
  {
    name: `Voltar para o menu ${name}`,
    value: 'back',
  },
  {
    name: `Exibir mais ${name}`,
    value: 'repeat',
  },
  {
    name: 'Sair',
    value: 'exit',
  },
];

const nextAction = async (callback, dependences, goBackToMenu) => {
  const nextAction = await showMenuOptions({
    message: 'O que deseja fazer agora?',
    choices: NEXT_ACTION_CHOICES(dependences.name),
  });

  if (nextAction === 'back') {
    return goBackToMenu();
  }

  if (nextAction === 'repeat') {
    return callback(dependences, goBackToMenu);
  }

  return console.log('OK, até logo!');
};

const removeEmptyProperties = (object) =>
  Object.fromEntries(Object.entries(object).filter(([_, value]) => !isEmpty(value)));

const showMenuInsert = async ({ message }) =>
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message,
    validate: (value) => typeof value === 'string' || 'Invalid Name',
  });

const showMenuOptions = async ({ message, choices }) =>
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message,
      choices,
    })
    .then(({ choice }) => choice);

module.exports = {
  addExtraChoices,
  getDataFromPage,
  isEmpty,
  nextAction,
  removeEmptyProperties,
  showMenuInsert,
  showMenuOptions,
};
