
// finds the lowest fare,
// given an array of fares and the number of rides needed.

export default function findLowestFare(fares, ridesNeeded) {
  if (fares === undefined || fares.length === 0
     || ridesNeeded === undefined || isNaN(ridesNeeded)
     || ridesNeeded <= 0) {
    return 0;
  } else if (fares.length === 1) {
    return fares[0].price * ridesNeeded;
  }

  const highest = fares.sort((a, b) => b.price - a.price)[0];
  const lowest = fares.sort((a, b) => a.price - b.price)[0];

  const thresholds = fares.map(item => Math.ceil(highest.price / item.price))
  .filter(item => item !== 1)
  .sort((a, b) => a - b);

  const remainingTickets = ridesNeeded % highest.trips;

  if (remainingTickets >= thresholds[0]) {
    return highest.price * Math.ceil(ridesNeeded / highest.trips);
  }
  return (highest.price * Math.floor(ridesNeeded / highest.trips))
  + (lowest.price * remainingTickets);
}
