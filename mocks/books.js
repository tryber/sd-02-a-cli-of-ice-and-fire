const firstPageBody = [
  {
    url: "https://www.anapioficeandfire.com/api/books/1",
    name: "A Game of Thrones",
    isbn: "978-0553103540",
    authors: [
      "George R. R. Martin"
    ],
    numberOfPages: 694,
    publisher: "Bantam Books",
    country: "United States",
    mediaType: "Hardcover",
    released: "1996-08-01T00:00:00",
    characters: [
      "https://www.anapioficeandfire.com/api/characters/2",
      "https://www.anapioficeandfire.com/api/characters/12",
      "https://www.anapioficeandfire.com/api/characters/13",
      "https://www.anapioficeandfire.com/api/characters/16",
      "https://www.anapioficeandfire.com/api/characters/20",
      "https://www.anapioficeandfire.com/api/characters/27",
      "https://www.anapioficeandfire.com/api/characters/31",
      "https://www.anapioficeandfire.com/api/characters/38",
      "https://www.anapioficeandfire.com/api/characters/2121"
    ],
    povCharacters: [
      "https://www.anapioficeandfire.com/api/characters/148",
      "https://www.anapioficeandfire.com/api/characters/208",
    ]
  },
  {
    url: "https://www.anapioficeandfire.com/api/books/2",
    name: "A Clash of Kings",
    isbn: "978-0553108033",
    authors: [
      "George R. R. Martin"
    ],
    numberOfPages: 768,
    publisher: "Bantam Books",
    country: "United States",
    mediaType: "Hardback",
    released: "1999-02-02T00:00:00",
    characters: [
      "https://www.anapioficeandfire.com/api/characters/2",
      "https://www.anapioficeandfire.com/api/characters/12",
      "https://www.anapioficeandfire.com/api/characters/13",
      "https://www.anapioficeandfire.com/api/characters/16",
      "https://www.anapioficeandfire.com/api/characters/20",
      "https://www.anapioficeandfire.com/api/characters/112",

    ],
    povCharacters: [
      "https://www.anapioficeandfire.com/api/characters/148",
    ]
  },
];


const secondPageBody = [
  {
    url: "https://www.anapioficeandfire.com/api/books/19",
    name: "Taylor Swift Is God",
    isbn: "978-0553103540",
    authors: [
      "Rian L Soares"
    ],
    numberOfPages: 694,
    publisher: "Bantam Books",
    country: "United States",
    mediaType: "Hardcover",
    released: "1996-08-01T00:00:00",
    characters: [
      "https://www.anapioficeandfire.com/api/characters/2",
      "https://www.anapioficeandfire.com/api/characters/12",
    ],
    povCharacters: [
      "https://www.anapioficeandfire.com/api/characters/148",
      "https://www.anapioficeandfire.com/api/characters/208",
    ]
  },
  {
    url: "https://www.anapioficeandfire.com/api/books/2",
    name: "Melodrama Best Album",
    isbn: "978-0553108033",
    authors: [
      "Anderson Bolivar"
    ],
    numberOfPages: 768,
    publisher: "Bantam Books",
    country: "United States",
    mediaType: "Hardback",
    released: "1999-02-02T00:00:00",
    characters: [
      "https://www.anapioficeandfire.com/api/characters/2",
      "https://www.anapioficeandfire.com/api/characters/12",
    ],
    povCharacters: [
      "https://www.anapioficeandfire.com/api/characters/148",
    ]
  },
];

const lastPageBody = [
  {
    url: "https://www.anapioficeandfire.com/api/books/3",
    name: "A Storm of Swords",
    isbn: "978-0553106633",
    authors: [
      "George R. R. Martin"
    ],
    numberOfPages: 992,
    publisher: "Bantam Books",
    country: "United States",
    mediaType: "Hardcover",
    released: "2000-10-31T00:00:00",
    characters: [
      "https://www.anapioficeandfire.com/api/characters/2",
      "https://www.anapioficeandfire.com/api/characters/3",
      "https://www.anapioficeandfire.com/api/characters/7",
      "https://www.anapioficeandfire.com/api/characters/12",
      "https://www.anapioficeandfire.com/api/characters/13",
      "https://www.anapioficeandfire.com/api/characters/16",
      "https://www.anapioficeandfire.com/api/characters/20",
      "https://www.anapioficeandfire.com/api/characters/1195",
    ],
    povCharacters: [
      "https://www.anapioficeandfire.com/api/characters/148",
      "https://www.anapioficeandfire.com/api/characters/208",
    ]
  },
  {
    url: "https://www.anapioficeandfire.com/api/books/4",
    name: "The Hedge Knight",
    isbn: "978-0976401100",
    authors: [
      "George R. R. Martin"
    ],
    numberOfPages: 164,
    publisher: "Dabel Brothers Publishing",
    country: "United States",
    mediaType: "GraphicNovel",
    released: "2005-03-09T00:00:00",
    characters: [
      "https://www.anapioficeandfire.com/api/characters/29",
      "https://www.anapioficeandfire.com/api/characters/38",
      "https://www.anapioficeandfire.com/api/characters/40",
      "https://www.anapioficeandfire.com/api/characters/41",
      "https://www.anapioficeandfire.com/api/characters/46",
    ],
    povCharacters: [
      "https://www.anapioficeandfire.com/api/characters/329"
    ]
  },
];

const linkHeaders = {
  hasNext: '<https://www.anapioficeandfire.com/api/books?page=2&pageSize=10>; rel="next", <https://www.anapioficeandfire.com/api/books?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/books?page=214&pageSize=10>; rel="last"',
  hasPrevious: '<https://www.anapioficeandfire.com/api/books?page=213&pageSize=10>; rel="prev", <https://www.anapioficeandfire.com/api/books?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/books?page=214&pageSize=10>; rel="last"',
  hasBoth: '<https://www.anapioficeandfire.com/api/books?page=3&pageSize=10>; rel="next", <https://www.anapioficeandfire.com/api/books?page=1&pageSize=10>; rel="prev", <https://www.anapioficeandfire.com/api/books?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/books?page=214&pageSize=10>; rel="last"',
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

