const run = require('inquirer-test');
const utils = require("./lib/utils.js");

jest.spyOn(utils, "getDataFromPage", async () => {
  return jest.fn();
});

describe("CLI - Game Of Thrones", () => {
  test("Main Menu", async () => {
    const result = await run([__dirname], []);

    expect(result.includes("Boas vindas! Escolha um menu para continuar")).toBeTruthy();
    expect(result.includes("Personagens")).toBeTruthy();
    expect(result.includes("Livros")).toBeTruthy();
    expect(result.includes("Casas")).toBeTruthy();
    expect(result.includes("Sair")).toBeTruthy();
  });

  test("Main Menu - Exit", async () => {
    const { DOWN, ENTER } = run;
    const result = await run([__dirname], [DOWN, DOWN, DOWN, ENTER]);

    expect(result.includes("OK... Até mais!")).toBeTruthy();
  });


  ["Personagens", "Livros", "Casas"]
    .forEach((menu, index) => {
      test(`Menu - ${menu}`, async () => {
        const { DOWN, ENTER } = run;
        let clicks = [];

        for (let i = 0; i < index; i += 1) {
          clicks.push(DOWN);
        }

        const result = await run([__dirname], [...clicks, ENTER]);

        expect(result.includes(`Menu de ${menu}`)).toBeTruthy();
        expect(result.includes(`Listar ${menu}`)).toBeTruthy();
        expect(result.includes(`Pesquisar ${menu}`)).toBeTruthy();
        expect(result.includes("Voltar para o menu principal")).toBeTruthy();
      });
    });


  ["Personagens", "Livros", "Casas"]
    .forEach((menu, index) => {
      test(`Listar - ${menu}`, async () => {
        const { DOWN, ENTER } = run;
        let clicks = [];

        for (let i = 0; i < index; i += 1) {
          clicks.push(DOWN);
        }

        const result = await run([__dirname], [...clicks, ENTER, ENTER]);

        console.log(result)
      });
    });

})

