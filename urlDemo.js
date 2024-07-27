import url from 'url';

const urlString = 'https://google.com/search?q=hello+world';

// URL Object
const urlObj = new URL(urlString);

console.log(urlObj);

// format()
console.log(url.format(urlObj));

// import.meta.url - file url
console.log(import.meta.url);
