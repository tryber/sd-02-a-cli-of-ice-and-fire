const superagent = require('superagent');

const {
  parseLinks,
} = require('./lib/utils');


const FIRST_PAGE_LINK = 'https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10';

const getCharactersFromPage = async (pageLink) => {
  try {
    const res = await superagent.get(pageLink);
    console.log(res.body);
    const links = parseLinks(res.headers.link);
    console.log('----------');
    console.log(links);
  } catch (err) {
    console.error(err);
  }
};

getCharactersFromPage(FIRST_PAGE_LINK);
