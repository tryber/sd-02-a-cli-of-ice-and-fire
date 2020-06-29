const firstPageBody = [
  {
    url: 'https://www.anapioficeandfire.com/api/characters/1',
    name: '',
    gender: 'Female',
    culture: 'Braavosi',
    born: '',
    died: '',
    titles: [
      '',
    ],
    aliases: [
      'The Daughter of the Dusk',
    ],
    father: '',
    mother: '',
    spouse: '',
    allegiances: [],
    books: [
      'https://www.anapioficeandfire.com/api/books/5',
    ],
    povBooks: [],
    tvSeries: [
      '',
    ],
    playedBy: [
      '',
    ],
  },
  {
    url: 'https://www.anapioficeandfire.com/api/characters/2',
    name: 'Walder',
    gender: 'Male',
    culture: '',
    born: '',
    died: '',
    titles: [
      '',
    ],
    aliases: [
      'Hodor',
    ],
    father: '',
    mother: '',
    spouse: '',
    allegiances: [
      'https://www.anapioficeandfire.com/api/houses/362',
    ],
    books: [
      'https://www.anapioficeandfire.com/api/books/1',
      'https://www.anapioficeandfire.com/api/books/2',
      'https://www.anapioficeandfire.com/api/books/3',
      'https://www.anapioficeandfire.com/api/books/5',
      'https://www.anapioficeandfire.com/api/books/8',
    ],
    povBooks: [],
    tvSeries: [
      'Season 1',
      'Season 2',
      'Season 3',
      'Season 4',
      'Season 6',
    ],
    playedBy: [
      'Kristian Nairn',
    ],
  },
];

const secondPageBody = [
  {
    url: 'https://www.anapioficeandfire.com/api/characters/19',
    name: 'Moelle',
    gender: 'Female',
    culture: '',
    born: '',
    died: '',
    titles: [
      'Septa',
    ],
    aliases: [
      '',
    ],
    father: '',
    mother: '',
    spouse: '',
    allegiances: [],
    books: [
      'https://www.anapioficeandfire.com/api/books/5',
      'https://www.anapioficeandfire.com/api/books/8',
    ],
    povBooks: [],
    tvSeries: [
      '',
    ],
    playedBy: [
      '',
    ],
  },
  {
    url: 'https://www.anapioficeandfire.com/api/characters/20',
    name: 'Mordane',
    gender: 'Female',
    culture: '',
    born: '',
    died: 'In 298 AC, at King\'s Landing',
    titles: [
      'Septa',
    ],
    aliases: [
      '',
    ],
    father: '',
    mother: '',
    spouse: '',
    allegiances: [
      'https://www.anapioficeandfire.com/api/houses/362',
    ],
    books: [
      'https://www.anapioficeandfire.com/api/books/1',
      'https://www.anapioficeandfire.com/api/books/2',
      'https://www.anapioficeandfire.com/api/books/3',
    ],
    povBooks: [],
    tvSeries: [
      'Season 1',
    ],
    playedBy: [
      'Susan Brown',
    ],
  },
];

const lastPageBody = [
  {
    url: 'https://www.anapioficeandfire.com/api/characters/2135',
    name: 'Zekko',
    gender: 'Male',
    culture: 'Dothraki',
    born: '',
    died: '',
    titles: [
      'Khal',
    ],
    aliases: [
      '',
    ],
    father: '',
    mother: '',
    spouse: '',
    allegiances: [],
    books: [
      'https://www.anapioficeandfire.com/api/books/8',
    ],
    povBooks: [],
    tvSeries: [
      '',
    ],
    playedBy: [
      '',
    ],
  },
  {
    url: 'https://www.anapioficeandfire.com/api/characters/2136',
    name: 'Zharaq zo Loraq',
    gender: 'Male',
    culture: 'Ghiscari',
    born: '',
    died: '',
    titles: [
      '',
    ],
    aliases: [
      'The Liberator',
    ],
    father: '',
    mother: '',
    spouse: '',
    allegiances: [],
    books: [
      'https://www.anapioficeandfire.com/api/books/8',
    ],
    povBooks: [],
    tvSeries: [
      '',
    ],
    playedBy: [
      '',
    ],
  },
];

const linkHeaders = {
  hasNext: '<https://www.anapioficeandfire.com/api/characters?page=2&pageSize=10>; rel="next", <https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/characters?page=214&pageSize=10>; rel="last"',
  hasPrevious: '<https://www.anapioficeandfire.com/api/characters?page=213&pageSize=10>; rel="prev", <https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/characters?page=214&pageSize=10>; rel="last"',
  hasBoth: '<https://www.anapioficeandfire.com/api/characters?page=3&pageSize=10>; rel="next", <https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10>; rel="prev", <https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/characters?page=214&pageSize=10>; rel="last"',
};

const responses = {
  hasNext: { body: firstPageBody, headers: { link: linkHeaders.hasNext } },
  hasPrevious: { body: lastPageBody, headers: { link: linkHeaders.hasPrevious } },
  hasBoth: { body: secondPageBody, headers: { link: linkHeaders.hasBoth } },
};

function getNames(body) {
  return body.map(({ name, aliases }) => name || aliases[0]);
}

const names = {
  hasNext: getNames(firstPageBody),
  hasPrevious: getNames(lastPageBody),
  hasBoth: getNames(secondPageBody),
};

module.exports = {
  responses,
  names,
};
