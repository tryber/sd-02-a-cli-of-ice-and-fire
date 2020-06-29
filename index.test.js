const run = require('inquirer-test');
const inquirer = require('inquirer');
const superagent = require('superagent');
const cli = require('./lib/cli');
const utils = require('./lib/utils');
const menus = require('./lib/menus');
const actions = require('./lib/actions');
const { books } = require('./lib/dependences');
const { responses: booksDataMock, names } = require('./mocks/books');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('CLI - Game Of Thrones', () => {
  test('Main Menu - Options', async () => {
    const promptMock = jest
      .spyOn(inquirer, 'prompt')
      .mockImplementation(async () => ({ choice: 'test' }));

    const menusMock = ['Personagens', 'Livros', 'Casas', 'Sair'];

    await cli.run();

    expect(promptMock.mock.calls[0][0].message).toBe('Boas vindas! Escolha um menu para continuar');

    const menus = promptMock.mock.calls[0][0].choices.map(({ name }) => name);

    expect(menus).toEqual(menusMock);
  });

  test('Main Menu - Exit', async () => {
    jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({ choice: 'exit' }));

    await cli.run();

    expect(console.log).toHaveBeenCalledWith;
    ('Ok... Até mais!');
  });

  test('Main Menu - Books', async () => {
    jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({ choice: 'books' }));

    const showMenuMocks = jest.spyOn(menus, 'run').mockImplementation(() => ({}));

    await cli.run();

    expect(showMenuMocks.mock.calls[0][0].endpoint).toBe('books');
  });

  test('Main Menu - Books', async () => {
    jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({ choice: 'books' }));

    const showMenuMocks = jest.spyOn(menus, 'run').mockImplementation(() => ({}));

    await cli.run();

    expect(showMenuMocks.mock.calls[0][0].endpoint).toBe('books');
  });

  test('Menu Books - Options', async () => {
    const promptMock = jest
      .spyOn(inquirer, 'prompt')
      .mockImplementation(async () => ({ choice: 'test' }));

    await menus.run(books, () => ({}));

    const optionsMock = ['Listar Livros', 'Pesquisar Livros', 'Voltar para o menu principal'];

    const options = promptMock.mock.calls[0][0].choices.map(({ name }) => name);

    expect(promptMock.mock.calls[0][0].message).toBe("'Menu de Livros -- Escolha uma ação'");
    expect(options).toEqual(optionsMock);
  });

  test('Menu Books - Back', async () => {
    jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({ choice: 'back' }));

    const goBackToMainMenu = jest.fn();

    await menus.run(books, goBackToMainMenu);

    expect(goBackToMainMenu).toHaveBeenCalledTimes(1);
  });

  test('Menu Books - Actions - List', async () => {
    jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({ choice: 'list' }));

    const showList = jest.spyOn(actions.list, 'run').mockImplementation(() => ({}));

    await menus.run(books, () => ({}));

    expect(showList.mock.calls[0][0].endpoint).toBe('books');
    expect(showList.mock.calls[0][0].name).toEqual(['Livros', 'um livro', 'o livro', 'o']);
    expect(showList.mock.calls[0][0].remove).toEqual(['characters', 'povCharacters']);
  });

  test('Action List', async () => {
    inquirer.prompt = jest
      .fn()
      .mockResolvedValueOnce({ choice: 'Taylor Swift Is God' })
      .mockResolvedValue({ choice: 'back' });

    jest.spyOn(superagent, 'get').mockImplementation(async () => booksDataMock.hasBoth);

    await actions.list.run(books, () => ({}));

    const choices = inquirer.prompt.mock.calls[0][0].choices
      .map(({ name }) => name)
      .filter((name) => name);

    expect(inquirer.prompt.mock.calls[0][0].message).toBe(
      "'[Listar Livros] - Escolha o livro para ver mais detalhes'",
    );

    expect(choices).toEqual([
      'Taylor Swift Is God',
      'Melodrama Best Album',
      'Próxima página',
      'Página anterior',
      'Voltar para o menu anterior',
    ]);
  });

  test('Action List', async () => {
    inquirer.prompt = jest
      .fn()
      .mockResolvedValueOnce({ choice: 'Taylor Swift Is God' })
      .mockResolvedValue({ choice: 'back' });

    jest.spyOn(superagent, 'get').mockImplementation(async () => booksDataMock.hasBoth);

    await actions.list.run(books, () => ({}));

    const choices = inquirer.prompt.mock.calls[0][0].choices
      .map(({ name }) => name)
      .filter((name) => name);

    expect(choices).toEqual([
      'Taylor Swift Is God',
      'Melodrama Best Album',
      'Próxima página',
      'Página anterior',
      'Voltar para o menu anterior',
    ]);
  });

  test('Action Search - Data Not Find', async () => {
    inquirer.prompt = jest
      .fn()
      .mockResolvedValueOnce({ name: 'Lana Del Rey' })
      .mockResolvedValue({ choice: 'back' });

    const availableLInks = names.hasBoth.map(
      (name) => `www.anapioficeandfire.com/api/books?name=${name}`,
    );

    jest.spyOn(superagent, 'get').mockImplementation(async (link) => {
      if (availableLInks.includes(link)) return booksDataMock.hasBoth;
      return {
        body: [],
        headers: {
          link:
            '<https://www.anapioficeandfire.com/api/books?name=df&page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/books?name=df&page=1&pageSize=10>; rel="last"',
        },
      };
    });

    await actions.search.run(books, () => ({}));

    expect(console.log).toHaveBeenCalledWith;
    ('Nenhumo livro encontrado para essa pesquisa');
  });

  test('Action Search - Data Finded', async () => {
    inquirer.prompt = jest
      .fn()
      .mockResolvedValueOnce({ name: 'Taylor Swift Is God' })
      .mockResolvedValue({ choice: 'back' });

    jest.spyOn(superagent, 'get').mockImplementation(async () => booksDataMock.hasBoth);

    await actions.search.run(books, () => ({}));

    expect(console.log).toHaveBeenCalledWith;
    ('Taylor Swift Is God');
  });
});
