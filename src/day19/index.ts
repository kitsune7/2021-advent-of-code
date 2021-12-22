import { DayFunction, transformVector } from "../utilities";

type Coordinate = [number, number, number];
type Scanner = Coordinate[];

const transforms = [
  [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  [
    [-1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  [
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ],
  [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ],
  [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
  ],
  [
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
  ],

  [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ],
  [
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ],
  [
    [0, -1, 0],
    [-1, 0, 0],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [-1, 0, 0],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [-1, 0, 0],
    [0, 0, -1],
  ],
  [
    [0, -1, 0],
    [-1, 0, 0],
    [0, 0, -1],
  ],

  [
    [1, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
  ],
  [
    [-1, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
  ],
  [
    [-1, 0, 0],
    [0, 0, -1],
    [0, 1, 0],
  ],
  [
    [1, 0, 0],
    [0, 0, -1],
    [0, 1, 0],
  ],
  [
    [1, 0, 0],
    [0, 0, -1],
    [0, -1, 0],
  ],
  [
    [-1, 0, 0],
    [0, 0, -1],
    [0, -1, 0],
  ],

  [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],
  [
    [0, 0, -1],
    [0, 1, 0],
    [1, 0, 0],
  ],
  [
    [0, 0, -1],
    [0, -1, 0],
    [1, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, -1, 0],
    [1, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, -1, 0],
    [-1, 0, 0],
  ],
  [
    [0, 0, -1],
    [0, -1, 0],
    [-1, 0, 0],
  ],
];

const dayFunction: DayFunction = (input: string[]) => {
  const scanners: Scanner[] = [];
  const fullMap = new Set<string>();
  const minimumBeaconsOverlapping = 12;
  let mainScannerData: { beacon: Coordinate; distances: string[] }[] = [];

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

  function recalculateDistances() {
    const mainBeacons = mainScannerData.map((item) => item.beacon);
    mainScannerData = mainScannerData.map((item, index) => ({
      beacon: item.beacon,
      distances: getBeaconDistances(mainBeacons, index),
    }));
  }

  function addShiftedBeaconsToMap(
    matches: Coordinate[][],
    scannerIndex: number
  ) {
    const offset = calculateOffset(matches[0]);
    const shiftedScanner = shiftScanner(offset, scanners[scannerIndex]);
    shiftedScanner.forEach((beacon) => {
      fullMap.add(beacon.toString());

      if (
        !mainScannerData.find(
          (mainBeacon) => mainBeacon.toString() === beacon.toString()
        )
      ) {
        mainScannerData.push({
          beacon,
          distances: [],
        });
        recalculateDistances();
      }
    });
  }

  function transformScanner(scanner: Scanner, transformIndex: number) {
    scanner.forEach((beacon, beaconIndex) => {
      scanner[beaconIndex] = transformVector(
        beacon,
        transforms[transformIndex]
      ) as Coordinate;
    });
  }

  function getTransformedScanner(scanner: Scanner, transformIndex: number) {
    const transformedScanner = [];

    scanner.forEach((beacon, beaconIndex) => {
      transformedScanner.push(
        transformVector(beacon, transforms[transformIndex]) as Coordinate
      );
    });

    return transformedScanner;
  }

  function addScannerBeaconsToMap(scanner: Scanner, index: number) {
    let matches = getScannerMatches(scanner);

    for (let i = 0; i < transforms.length; i++) {
      // This code assumes that the first transform is the identity matrix
      if (i > 0) {
        transformScanner(scanner, i);
        matches = getScannerMatches(scanner);
        if (
          scanner.find(
            (beacon) =>
              beacon[0] - 20 === 459 &&
              beacon[1] - 1133 === -707 &&
              beacon[2] + 1061 === 401
          )
        ) {
          console.log(`found potential match at transform index`, i);
          console.log(scanner);
        }
      }

      if (matches.length && isCorrectOrientation(matches)) {
        addShiftedBeaconsToMap(matches, index + 1);
        return;
      }
    }

    console.log(`Something's gone wrong.`);
  }

  const transformed = [];
  for (let i = 0; i < transforms.length; i++) {
    transformed.push(
      shiftScanner([-20, -1133, 1061], getTransformedScanner(scanners[2], i))
    );
    if (
      transformed[transformed.length - 1].find(
        (beacon) => beacon.toString() === "459,-707,401"
      )
    ) {
      console.log(transformed);
    }
  }

  scanners.slice(1).forEach((scanner, index) => {
    console.log(`Adding scanner ${index + 1} to map`);
    addScannerBeaconsToMap(scanner, index);
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
    if (scanner[beaconIndex].toString() === scanner[i].toString()) continue;

    const xDistance = Math.abs(scanner[beaconIndex][0] - scanner[i][0]);
    const yDistance = Math.abs(scanner[beaconIndex][1] - scanner[i][1]);
    const zDistance = Math.abs(scanner[beaconIndex][2] - scanner[i][2]);
    const distanceString = `${xDistance},${yDistance},${zDistance}`;

    distances.push(distanceString);
  }

  return distances.sort();
}

function isCorrectOrientation(matches: Coordinate[][]): boolean {
  const firstOffset = calculateOffset(matches[0]).toString();
  return matches
    .slice(1)
    .every((match) => calculateOffset(match).toString() === firstOffset);
}

function calculateOffset(match: Coordinate[]): Coordinate {
  return [
    match[1][0] - match[0][0],
    match[1][1] - match[0][1],
    match[1][2] - match[0][2],
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
