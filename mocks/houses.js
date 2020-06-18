const firstPageBody = [
  {
    url: "https://www.anapioficeandfire.com/api/houses/1",
    name: "House Algood",
    region: "The Westerlands",
    coatOfArms: "A golden wreath, on a blue field with a gold border(Azure, a garland of laurel within a bordure or)",
    words: "",
    titles: [
      ""
    ],
    seats: [
      ""
    ],
    currentLord: "",
    heir: "",
    overlord: "https://www.anapioficeandfire.com/api/houses/229",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: []
  },
  {
    url: "https://www.anapioficeandfire.com/api/houses/2",
    name: "House Allyrion of Godsgrace",
    region: "Dorne",
    coatOfArms: "Gyronny Gules and Sable, a hand couped Or",
    words: "No Foe May Pass",
    titles: [
      ""
    ],
    seats: [
      "Godsgrace"
    ],
    currentLord: "https://www.anapioficeandfire.com/api/characters/298",
    heir: "https://www.anapioficeandfire.com/api/characters/1922",
    overlord: "https://www.anapioficeandfire.com/api/houses/285",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: [
      "https://www.anapioficeandfire.com/api/characters/298",
      "https://www.anapioficeandfire.com/api/characters/1129",
      "https://www.anapioficeandfire.com/api/characters/1301",
      "https://www.anapioficeandfire.com/api/characters/1922"
    ]
  },
];

const secondPageBody = [
  {
    url: "https://www.anapioficeandfire.com/api/houses/19",
    name: "House Amber",
    region: "The North",
    coatOfArms: "",
    words: "",
    titles: [
      ""
    ],
    seats: [
      ""
    ],
    currentLord: "",
    heir: "",
    overlord: "",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: []
  },
  {
    url: "https://www.anapioficeandfire.com/api/houses/20",
    name: "House Fierce",
    region: "Dorne",
    coatOfArms: "Gyronny Gules and Sable, a hand couped Or",
    words: "No Foe May Pass",
    titles: [
      ""
    ],
    seats: [
      "Godsgrace"
    ],
    currentLord: "https://www.anapioficeandfire.com/api/characters/298",
    heir: "https://www.anapioficeandfire.com/api/characters/1922",
    overlord: "https://www.anapioficeandfire.com/api/houses/285",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: [
      "https://www.anapioficeandfire.com/api/characters/298",
      "https://www.anapioficeandfire.com/api/characters/1129",
      "https://www.anapioficeandfire.com/api/characters/1301",
      "https://www.anapioficeandfire.com/api/characters/1922"
    ]
  },
];

const lastPageBody = [
  {
    url: "https://www.anapioficeandfire.com/api/houses/4",
    name: "House Ambrose",
    region: "The Reach",
    coatOfArms: "Or, semy of ants gules",
    words: "Never Resting",
    titles: [
      ""
    ],
    seats: [
      ""
    ],
    currentLord: "https://www.anapioficeandfire.com/api/characters/141",
    heir: "",
    overlord: "https://www.anapioficeandfire.com/api/houses/398",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: [
      "https://www.anapioficeandfire.com/api/characters/82",
      "https://www.anapioficeandfire.com/api/characters/102",
      "https://www.anapioficeandfire.com/api/characters/141",
      "https://www.anapioficeandfire.com/api/characters/152",
      "https://www.anapioficeandfire.com/api/characters/344"
    ]
  },
  {
    url: "https://www.anapioficeandfire.com/api/houses/5",
    name: "House Appleton of Appleton",
    region: "The Reach",
    coatOfArms: "Or, an apple tree eradicated proper fructed gules, quartered with argent, a gatehouse cendrée",
    words: "",
    titles: [
      ""
    ],
    seats: [
      "Appleton"
    ],
    currentLord: "",
    heir: "",
    overlord: "https://www.anapioficeandfire.com/api/houses/398",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: []
  },
];

const linkHeaders = {
  hasNext: '<https://www.anapioficeandfire.com/api/houses?page=2&pageSize=10>; rel="next", <https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/houses?page=214&pageSize=10>; rel="last"',
  hasPrevious: '<https://www.anapioficeandfire.com/api/houses?page=213&pageSize=10>; rel="prev", <https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/houses?page=214&pageSize=10>; rel="last"',
  hasBoth: '<https://www.anapioficeandfire.com/api/houses?page=3&pageSize=10>; rel="next", <https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10>; rel="prev", <https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/houses?page=214&pageSize=10>; rel="last"',
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
