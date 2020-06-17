const inquirer = require('inquirer');

/**
 * Recebe o valor do header `link`, retornado da API, e retorna um objeto com os links e
 * suas URLs
 * @param {string} links Header `link` retornado da API
 */
function parseLinks(links) {
  /**
   * Usamos Object.fromEntries para construir um objeto a partir do array de
   * chaves e valores que vamos construir
   */
  return Object.fromEntries(
    /**
     * Dividimos o header link nas vírgulas, o que nos dá um array de strings no formato:
     * '<url-do-link>; rel=tipo-do-link'
     */
    links
      .split(',')
      /**
       * Dividimos cada item do array no ponto e vírgula, obtendo um array de arrays com o formato:
       * ['<url-do-link>', ' rel=tipo-do-link']
       * Cada item com esse formato é chamado de "par" daqui em diante
       */
      .map((link) => link.split(';'))
      /**
       * Para cada par, removemos os espaços em branco, obtendo
       * ['<url-do-link>', 'rel=tipo-do-link']
       */
      .map((linkPairs) => linkPairs.map((part) => part.trim()))
      /**
       * Para cada par, utilizamos regex pra substituir os caracteres indesejados, e aproveitamos
       * pra trocar a ordem dos pares, obtendo
       * ['tipo-do-link', 'url-do-link']
       */
      .map(([link, rel]) => [
        rel.replace(/(?:rel)|"|=/gi, ''),
        link.replace(/<|>/g, ''),
      ])
      /**
       * Por último, removemos os links do tipo `first` e `last`, já que eles não serão utilizados
       */
      .filter(([rel]) => rel !== 'first' && rel !== 'last'),
  );
}

const showMenuOptions = async ({ message, choices }) =>
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message,
      choices,
    })
    .then(({ choice }) => choice);

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

const removeEmptyProperties = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([_, value]) => !isEmpty(value)),
  );

const booksNameReceive = async () => (
  inquirer
    .prompt({
      type: 'input',
      name: 'choice',
      message: 'Digite o livro:',
    })
    .then(({ choice }) => choice)
);

module.exports = {
  isEmpty,
  parseLinks,
  showMenuOptions,
  addExtraChoices,
  removeEmptyProperties,
  booksNameReceive,
};
