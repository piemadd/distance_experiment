const fs = require('fs');
const turf = require('@turf/turf');

//loading all the data in
const feeds = fs.readdirSync('./data');

let allData = [];

feeds.forEach((feedName) => {
  const actFeedName = feedName.replace('.json', '');
  const data = JSON.parse(fs.readFileSync(`./data/${feedName}`, { encoding: 'utf8' }));

  Object.values(data).forEach((station) => {
    allData.push({
      ...station,
      stopID: `${actFeedName}_${station.stopID}`,
    })
  })
})
console.log('Loaded in stops, starting benchmark');

console.time('distances');

const allDataWithDistances = allData.map((station) => {
  const from = turf.point([-87.63982508084484, 41.88205841829867]);
  const to = turf.point([station.stopLon, station.stopLat]);
  const options = { units: "kilometers" };

  const distance = turf.distance(from, to, options);

  return {
    ...station,
    distance,
  }
});

console.timeEnd('distances')
console.time('sorting')

const allDataSorted = allDataWithDistances.sort((a, b) => b.distance - a.distance);
const nearestTen = allDataSorted.slice(0, 10);

console.timeEnd('sorting')

console.log('total num of stops:', allDataSorted.length)