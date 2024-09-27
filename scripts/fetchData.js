const fs = require('fs');

const feeds = JSON.parse(fs.readFileSync('./feeds.json', { encoding: 'utf8' }));

if (fs.existsSync('./data')) fs.rmSync('./data', { force: true, recursive: true });
fs.mkdirSync('./data');

Object.keys(feeds).forEach((feedKey) => {
  if (feeds[feedKey]['disabled'] === true) return;
  fetch(`https://gtfs.piemadd.com/data/${feedKey}/stops.json`)
    .then((res) => res.json())
    .then((data) => {
      fs.writeFileSync(`./data/${feedKey}.json`, JSON.stringify(data, null, 2), { encoding: 'utf8' });
    })
})