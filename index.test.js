const run = require('inquirer-test');

describe("CLI - Game Of Thrones", () => {
  test("Main Menu", async () => {
    const result = await run([__dirname], []);

    expect(result.includes("Boas vindas! Escolha um menu para continuar")).toBeTruthy();
    expect(result.includes("Personagens")).toBeTruthy();
    expect(result.includes("Livros")).toBeTruthy();
    expect(result.includes("Casas")).toBeTruthy();
    expect(result.includes("Sair")).toBeTruthy();
  });

  // test("Main Menu", async () => {
  //   const { UP, DOWN, ENTER } = run;
  //   const result = await run([__dirname], [DOWN, DOWN, ENTER]);

  //   expect(result.includes("Boas vindas!")).toBeTruthy();
  //   expect(result.includes("Listar")).toBeTruthy();
  //   expect(result.includes("Pesquisar")).toBeTruthy();
  //   expect(result.includes("Voltar para o menu principal")).toBeTruthy();
  // });
})

