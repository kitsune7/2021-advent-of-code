import {
  DayFunction,
  incrementOrInstantiate,
  transformVector,
} from "../utilities";

type Coordinate = [number, number];
type Scanner = Coordinate[];

const dayFunction: DayFunction = (input: string[]) => {
  const scanners: Scanner[] = [];
  const fullMap = new Set<string>();
  const minimumBeaconsOverlapping = 3; // 12 normally

  // Setup scanner input
  let currentScanner = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i].startsWith("---") && i !== 0) {
      scanners.push(currentScanner);
      currentScanner = [];
    } else if (/(-)?[0-9]+,(-)?[0-9]+/.test(input[i])) {
      currentScanner.push(input[i].split(",").map(Number));
    }
  }
  scanners.push(currentScanner);

  // Set initial beacons on full map
  scanners[0].forEach((beacon) => fullMap.add(beacon.toString()));

  // Make a data structure to track scanner beacons with their distances to the other beacons in the scanner
  const scannersWithDistances = scanners.map((scanner) => {
    return scanner.map((coordinate) => ({
      coordinate,
      distances: [] as string[],
    }));
  });
  scannersWithDistances.forEach((scanner, index) => {
    for (let i = 0; i < scanner.length; i++) {
      for (let j = 0; j < scanner.length; j++) {
        if (i === j) continue;
        const distanceString = `${Math.abs(
          scanner[i].coordinate[0] - scanner[j].coordinate[0]
        )},${Math.abs(scanner[i].coordinate[1] - scanner[j].coordinate[1])}`;

        scanner[i].distances.push(distanceString);
      }
    }
    scanner.forEach((beacon) => {
      beacon.distances.sort();
    });
  });

  function calculateOffset(matches: Coordinate[][]): Coordinate {
    const firstMatch = matches[0];
    return [
      firstMatch[1][0] - firstMatch[0][0],
      firstMatch[1][1] - firstMatch[0][1],
    ];
  }

  function shiftScanner(
    offset: Coordinate,
    scanner: Coordinate[]
  ): Coordinate[] {
    return scanner.map((beacon) =>
      beacon.map((num, index) => num + offset[index])
    ) as Coordinate[];
  }

  // Find which beacons in a scanner match
  scannersWithDistances.forEach((scanner, index) => {
    console.log(`scanner ${index}`, scanner);
    // We're ignoring the first scanner because it's already on the map
    if (index !== 0) {
      const matches = [];
      scanner.forEach((beacon) => {
        const matchingBeacon = scannersWithDistances[0].find((mainBeacon) => {
          let count = 0;
          for (let i = 0; i < beacon.distances.length; i++) {
            if (mainBeacon.distances.includes(beacon.distances[i])) {
              count++;
            }
          }
          return count >= minimumBeaconsOverlapping - 1;
        });
        if (matchingBeacon) {
          matches.push([beacon.coordinate, matchingBeacon.coordinate]);
        }
      });

      if (matches.length >= minimumBeaconsOverlapping) {
        const offset = calculateOffset(matches);
        const shiftedScanner = shiftScanner(offset, scanners[index]);
        shiftedScanner.forEach((beacon) => fullMap.add(beacon.toString()));
      }
      console.log(`scanner ${index} matches`, matches);
    }
  });
  console.log("fullMap", fullMap);

  return fullMap.size;
};

export default dayFunction;

// const absoluteDistance = Math.sqrt(
//   (scanner[j][0] - scanner[i][0]) ** 2 +
//   (scanner[j][1] - scanner[i][1]) ** 2 +
//   (scanner[j][2] - scanner[i][2]) ** 2
// );

// ,${Math.abs(scanner[i][2] - scanner[j][2])}

// const totalBeacons = Object.values(distances).reduce(
//   (total, value) => total + (value > 1 ? 1 : 0),
//   0
// );

// console.log(
//   Object.fromEntries(
//     Object.entries(distances).filter(([_, value]) => value > 1)
//   )
// );

// return totalBeacons;
