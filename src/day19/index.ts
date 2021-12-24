import { DayFunction, Matrix, transformVector } from '../utilities'
import { transforms } from './transforms'

type Coordinate = [number, number, number]
type Scanner = Coordinate[]

const dayFunction: DayFunction = (input: string[]) => {
  const scanners: Scanner[] = getScannersFromInput()
  const shiftedScanners: Scanner[] = []
  const minimumBeaconsOverlapping = 12

  function getScannersFromInput(): Scanner[] {
    const scanners = []

    let currentScanner = []
    for (let i = 0; i < input.length; i++) {
      if (input[i].startsWith('---') && i !== 0) {
        scanners.push(currentScanner)
        currentScanner = []
      } else if (/(-)?[0-9]+,(-)?[0-9]+/.test(input[i])) {
        currentScanner.push(input[i].split(',').map(Number))
      }
    }
    scanners.push(currentScanner)

    return scanners
  }

  function getShiftedScanners() {
    const shiftedScannerIndexes: number[] = []

    while (shiftedScannerIndexes.length < scanners.length) {
      for (let i = 0; i < scanners.length; i++) {
        if (shiftedScannerIndexes.includes(i)) continue
        const scanner = scanners[i]

        console.log(`Adding scanner ${i} to shifted scanner list`)
        if (getShiftedScanner(scanner, i)) {
          shiftedScannerIndexes.push(i)
          console.log(`Added scanner ${i} to shifted scanner list successfully`)
        } else {
          console.log(`Failed to add scanner ${i}`)
        }
      }
    }
  }

  function getShiftedScanner(scanner: Scanner, index: number): boolean {
    console.log(`There are ${shiftedScanners.length} shifted scanners.`)

    // Use scanner 0 as the main point of reference
    if (!shiftedScanners.length) {
      shiftedScanners.push(scanner)
      return true
    }

    for (
      let shiftedScannerIndex = 0;
      shiftedScannerIndex < shiftedScanners.length;
      shiftedScannerIndex++
    ) {
      const shiftedScanner = shiftedScanners[shiftedScannerIndex]

      console.log(
        `Checking scanner ${index} for matches against (shifted) scanner ${shiftedScannerIndex}`
      )

      for (let i = 0; i < transforms.length; i++) {
        const transformed = getTransformedScanner(scanner, transforms[i])
        const matches = getScannerMatches(transformed, shiftedScanner)

        if (matches.length) {
          console.log(`Found ${matches.length} matches`)
          if (isCorrectOrientation(matches)) {
            console.log(matches)
            console.log('Orientation is correct. Adding shifted scanner.')
            console.log(`shifted:`, shiftScanner(calculateOffset(matches[0]), transformed))
            shiftedScanners.push(shiftScanner(calculateOffset(matches[0]), transformed))
            return true
          }
        }
      }
    }

    return false
  }

  function getTransformedScanner(scanner: Scanner, transformMatrix: Matrix<number>) {
    const transformedScanner = []

    scanner.forEach((beacon) => {
      transformedScanner.push(transformVector(beacon, transformMatrix) as Coordinate)
    })

    return transformedScanner
  }

  // I could probably optimize this by exiting as soon as I have 2 matches because that's all that's needed to check the
  // orientation.
  function getScannerMatches(
    scannerA: Scanner,
    scannerB: Scanner
  ): Array<[Coordinate, Coordinate]> {
    const matches = []

    scannerA.forEach((beaconA, beaconAIndex) => {
      scannerB.forEach((beaconB, beaconBIndex) => {
        const beaconADistances = getBeaconDistances(scannerA, beaconAIndex)
        const beaconBDistances = getBeaconDistances(scannerB, beaconBIndex)
        const matchingDistanceCount = countCommonDistances(beaconADistances, beaconBDistances)

        if (matchingDistanceCount >= minimumBeaconsOverlapping - 1) {
          matches.push([beaconA, beaconB])
        }
      })
    })

    return matches
  }

  function getBeaconDistances(scanner: Coordinate[], beaconIndex: number): number[] {
    const distances = []

    for (let i = 0; i < scanner.length; i++) {
      if (scanner[beaconIndex].toString() === scanner[i].toString()) continue
      distances.push(
        Math.sqrt(
          (scanner[beaconIndex][0] - scanner[i][0]) ** 2 +
            (scanner[beaconIndex][1] - scanner[i][1]) ** 2 +
            (scanner[beaconIndex][2] - scanner[i][2]) ** 2
        )
      )
    }

    return distances
  }

  function countCommonDistances(distancesA: number[], distancesB: number[]): number {
    let count = 0

    for (let i = 0; i < distancesA.length; i++) {
      for (let j = 0; j < distancesB.length; j++) {
        const distanceA = distancesA[i]
        const distanceB = distancesB[j]

        // I could try Math.floor or Math.ceil if there's some kind of odd JS error due to floating point imprecision
        if (distanceA === distanceB) {
          count++
        }
      }
    }

    return count
  }

  function isCorrectOrientation(matches: Array<[Coordinate, Coordinate]>): boolean {
    const firstOffset = calculateOffset(matches[0]).toString()
    console.log(`firstOffset`, firstOffset)
    return matches.slice(1).every((match) => calculateOffset(match).toString() === firstOffset)
  }

  function calculateOffset(match: Coordinate[]): Coordinate {
    return [match[1][0] - match[0][0], match[1][1] - match[0][1], match[1][2] - match[0][2]]
  }

  function shiftScanner(offset: Coordinate, scanner: Scanner): Scanner {
    return scanner.map((beacon) => beacon.map((num, index) => num + offset[index])) as Scanner
  }

  function getUniqueBeaconCount(): number {
    const fullMap = new Set<string>()

    shiftedScanners.forEach((scanner) =>
      scanner.forEach((beacon) => fullMap.add(beacon.toString()))
    )

    return fullMap.size
  }

  getShiftedScanners()
  return getUniqueBeaconCount()
}

export default dayFunction
