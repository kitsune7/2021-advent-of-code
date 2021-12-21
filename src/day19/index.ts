import {
  DayFunction,
  incrementOrInstantiate,
  transformVector,
} from "../utilities";

type Coordinate = [number, number, number];
type Scanner = Coordinate[];

const dayFunction: DayFunction = (input: string[]) => {
  const scanners: Scanner[] = [];
  const fullMap: Set<Coordinate> = new Set<Coordinate>();
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

  scanners[0].forEach((beacon) => fullMap.add(beacon));

  const scannersWithDistances = scanners.map((scanner) => {
    return scanner.map((coordinate) => ({
      coordinate,
      distances: [],
    }));
  });

  scannersWithDistances.forEach((scanner, index) => {
    for (let i = 0; i < scanner.length; i++) {
      for (let j = 0; j < scanner.length; j++) {
        if (i === j) continue;
        // const absoluteDistance = Math.sqrt(
        //   (scanner[j][0] - scanner[i][0]) ** 2 +
        //     (scanner[j][1] - scanner[i][1]) ** 2 +
        //     (scanner[j][2] - scanner[i][2]) ** 2
        // );
        const distanceString = `${Math.abs(
          scanner[i].coordinate[0] - scanner[j].coordinate[0]
        )},${Math.abs(scanner[i].coordinate[1] - scanner[j].coordinate[1])}`;
        // ,${Math.abs(scanner[i][2] - scanner[j][2])}
        scanner[i].distances.push(distanceString);
      }
    }
    scanner.forEach((beacon) => {
      beacon.distances.sort();
    });
  });

  scannersWithDistances.forEach((scanner, index) => {
    if (index !== 0) {
      const matches = scanner.filter((beacon) => {
        const matchingBeacon = scannersWithDistances[0].find((mainBeacon) => {
          let count = 0;
          for (let i = 0; i < beacon.distances.length; i++) {
            mainBeacon.distances.includes(beacon.distances[i]);
          }
          return count >= minimumBeaconsOverlapping - 1;
        }).coordinate;
        return [beacon.coordinate, matchingBeacon];
      });
      console.log(matches);
    }
    console.log(scanner);
  });
  console.log(fullMap);
  // console.log(distances);

  // const totalBeacons = Object.values(distances).reduce(
  //   (total, value) => total + (value > 1 ? 1 : 0),
  //   0
  // );

  // console.log(scanners[0][0]);
  // console.log(transformVector(scanners[0][0], flipX));

  // console.log(
  //   Object.fromEntries(
  //     Object.entries(distances).filter(([_, value]) => value > 1)
  //   )
  // );

  // return totalBeacons;
};

export default dayFunction;

// const absoluteDistance = Math.sqrt(
//   (scanner[j][0] - scanner[i][0]) ** 2 +
//   (scanner[j][1] - scanner[i][1]) ** 2 +
//   (scanner[j][2] - scanner[i][2]) ** 2
// );
