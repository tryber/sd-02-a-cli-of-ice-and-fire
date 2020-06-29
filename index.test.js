const run = require('inquirer-test');
const inquirer = require('inquirer');
const lib = require('./lib/cli');
const utils = require('./lib/utils');

// jest.spyOn(utils, "getDataFromPage", async () => {
//   return jest.fn();
// });

afterEach(() => {
  jest.resetAllMocks();
});

describe('CLI - Game Of Thrones', () => {
  test('Main Menu - Options', async () => {
    const promptMock = jest
      .spyOn(inquirer, 'prompt')
      .mockImplementation(async () => ({ choice: 'test' }));

    const menusMock = ['Personagens', 'Livros', 'Casas', 'Sair'];

    await lib.run();

    expect(promptMock.mock.calls[0][0].message).toBe('Boas vindas! Escolha um menu para continuar');

    const menus = promptMock.mock.calls[0][0].choices.map(({ name }) => name);

    expect(menus).toEqual(menusMock);
  });

  test('Main Menu - Exit', async () => {
    jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({ choice: 'exit' }));

    expect(console.log).toHaveBeenCalledWith;
    ('Ok... Até mais!');
  });
});
