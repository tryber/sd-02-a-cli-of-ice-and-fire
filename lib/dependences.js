const books = {
  endpoint: 'books',
  name: 'Livros',
  reference: 'um livro',
  remove: ['characters', 'povCharacters'],
};

const characters = {
  endpoint: 'characters',
  name: 'Personagens',
  reference: 'um personagem',
  remove: ['books', 'povBooks'],
};

const houses = {
  endpoint: 'houses',
  name: 'Casas',
  reference: 'uma casa',
  remove: [],
};

module.exports = {
  books,
  characters,
  houses,
};
