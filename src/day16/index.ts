import { DayFunction } from "../utilities";

type LiteralValue = number;
type BitsConsumed = number;

const dayFunction: DayFunction = (input: string[]) => {
  const hexToBin = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111",
  };
  const binaryData = input[0]
    .split("")
    .map((letter) => hexToBin[letter])
    .join("");

  const programData = {
    binary: binaryData,
    versionTotal: 0,
    subpackets: [],
  };

  function consumeBits(numberOfBits: number): string {
    const data = programData.binary.slice(0, numberOfBits);
    programData.binary = programData.binary.slice(numberOfBits);
    return data;
  }

  function getBinaryNumber(length: number): number {
    const data = consumeBits(length);
    return parseInt(data, 2);
  }

  function getVersion(): number {
    const version = getBinaryNumber(3);
    programData.versionTotal += version;
    return version;
  }

  function getTypeId(): number {
    return getBinaryNumber(3);
  }

  function getLiteralValue(): [LiteralValue, BitsConsumed] {
    let literalValue = "";
    let bitCount = 0;

    while (consumeBits(1) === "1") {
      literalValue += consumeBits(4);
      bitCount += 5;
    }
    literalValue += consumeBits(4);
    bitCount += 5;

    return [parseInt(literalValue, 2), bitCount];
  }

  function getOperator(): BitsConsumed {
    const lengthTypeId = consumeBits(1);
    let bitsUsed = 1;

    const lengthBits = lengthTypeId === "0" ? 15 : 11;
    const length = getBinaryNumber(lengthBits);
    bitsUsed += lengthBits;

    if (lengthTypeId === "0") {
      bitsUsed += getSubPacketsByLength(length);
    } else {
      bitsUsed += getSubPacketsByNumber(length);
    }

    return bitsUsed;
  }

  function getSubPackets(
    shouldContinue: (bitsUsed: number) => boolean
  ): BitsConsumed {
    let bitsUsed = 0;

    while (shouldContinue(bitsUsed)) {
      const version = getVersion();
      const typeId = getTypeId();
      bitsUsed += 6;

      if (typeId === 4) {
        const [literalValue, bitsUsedForValue] = getLiteralValue();
        bitsUsed += bitsUsedForValue;

        programData.subpackets.push({
          typeId,
          value: literalValue,
          version,
        });
      } else {
        bitsUsed += getOperator();
      }
    }

    return bitsUsed;
  }

  function getSubPacketsByLength(length: number): BitsConsumed {
    return getSubPackets((bitsUsed) => bitsUsed < length);
  }

  function getSubPacketsByNumber(numberOfPackets: number): BitsConsumed {
    let packetsConsumed = 0;
    return getSubPackets(() => packetsConsumed++ < numberOfPackets);
  }

  const mainVersion = getVersion();
  const mainTypeId = getTypeId();

  if (mainTypeId === 4) {
    getLiteralValue();
  } else {
    getOperator();
  }

  return programData.versionTotal;
};

export default dayFunction;
