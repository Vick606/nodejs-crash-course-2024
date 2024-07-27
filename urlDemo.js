import url from 'url';

const urlString = 'https://google.com/search?q=hello+world';

// URL Object
const urlObj = new URL(urlString);

console.log(urlObj);