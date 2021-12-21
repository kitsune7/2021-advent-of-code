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
  const mainScannerData: { beacon: Coordinate; distances: string[] }[] = [];

  void (function setup() {
    // Add scanners from input
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

    // Establish main scanner data
    scanners[0].forEach((beacon, beaconIndex) => {
      mainScannerData.push({
        beacon,
        distances: getBeaconDistances(scanners[0], beaconIndex),
      });
    });

    // Set initial beacons on full map
    scanners[0].forEach((beacon) => fullMap.add(beacon.toString()));
  })();

  function getBeaconMatch(
    scanner: Coordinate[],
    beaconIndex: number
  ): [Coordinate, Coordinate] | null {
    const distances = getBeaconDistances(scanner, beaconIndex);

    const match = mainScannerData.find((mainBeacon) => {
      let count = 0;
      for (let i = 0; i < distances.length; i++) {
        if (mainBeacon.distances.includes(distances[i])) count++;
      }

      return count >= minimumBeaconsOverlapping - 1;
    });

    return match ? [scanner[beaconIndex], match.beacon] : null;
  }

  function getScannerMatches(scanner: Coordinate[]): Array<Coordinate[]> {
    const matches = [];

    scanner.forEach((beacon, beaconIndex) => {
      const match = getBeaconMatch(scanner, beaconIndex);
      if (match) {
        matches.push(match);
      }
    });

    return matches;
  }

  function addShiftedBeaconsToMap(
    matches: Coordinate[][],
    scannerIndex: number
  ) {
    const offset = calculateOffset(matches);
    const shiftedScanner = shiftScanner(offset, scanners[scannerIndex]);
    shiftedScanner.forEach((beacon) => fullMap.add(beacon.toString()));
  }

  scanners.slice(1).forEach((scanner, index) => {
    const matches = getScannerMatches(scanner);

    if (matches.length >= minimumBeaconsOverlapping) {
      addShiftedBeaconsToMap(matches, index + 1);
    }
  });

  return fullMap.size;
};

export default dayFunction;

function getBeaconDistances(
  scanner: Coordinate[],
  beaconIndex: number
): string[] {
  const distances = [];

  for (let i = 0; i < scanner.length; i++) {
    if (i === beaconIndex) continue;

    const xDistance = Math.abs(scanner[beaconIndex][0] - scanner[i][0]);
    const yDistance = Math.abs(scanner[beaconIndex][1] - scanner[i][1]);
    // const zDistance = Math.abs(scanner[beaconIndex][2] - scanner[i][2]);
    const distanceString = `${xDistance},${yDistance}`; // ,${zDistance}`;

    distances.push(distanceString);
  }

  return distances.sort();
}

function calculateOffset(matches: Coordinate[][]): Coordinate {
  const firstMatch = matches[0];
  return [
    firstMatch[1][0] - firstMatch[0][0],
    firstMatch[1][1] - firstMatch[0][1],
    // firstMatch[1][2] - firstMatch[0][2],
  ];
}

function shiftScanner(offset: Coordinate, scanner: Coordinate[]): Coordinate[] {
  return scanner.map((beacon) =>
    beacon.map((num, index) => num + offset[index])
  ) as Coordinate[];
}

// const absoluteDistance = Math.sqrt(
//   (scanner[j][0] - scanner[i][0]) ** 2 +
//   (scanner[j][1] - scanner[i][1]) ** 2 +
//   (scanner[j][2] - scanner[i][2]) ** 2
// );

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
