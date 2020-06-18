const books = {
  endpoint: 'books',
  name: ['Livros', 'um livro', 'o livro', 'o'],
  remove: ['characters', 'povCharacters'],
};

const characters = {
  endpoint: 'characters',
  name: ['Personagens', 'um personagem', 'o personagem', 'o'],
  remove: ['books', 'povBooks'],
};

const houses = {
  endpoint: 'houses',
  name: ['Casas', 'uma casa', 'a casa', 'a'],
  remove: [],
};

module.exports = {
  books,
  characters,
  houses,
};
