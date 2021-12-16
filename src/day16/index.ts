import { DayFunction } from "../utilities";

type LiteralValue = number;
type BitsConsumed = number;
type ExpressionValue = number;
type SubPacket = {
  typeId: number;
  value: number;
  version: number;
};

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
    return getBinaryNumber(3);
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

  function evaluateExpression(typeId: number): [BitsConsumed, ExpressionValue] {
    const lengthTypeId = consumeBits(1);
    let bitsUsed = 1;

    const lengthBits = lengthTypeId === "0" ? 15 : 11;
    const length = getBinaryNumber(lengthBits);
    bitsUsed += lengthBits;

    const [bitsUsedBySubPackets, subPackets] =
      lengthTypeId === "0"
        ? getSubPacketsByLength(length)
        : getSubPacketsByNumber(length);
    bitsUsed += bitsUsedBySubPackets;

    switch (typeId) {
      case 0:
        console.log("+");
        return [
          bitsUsed,
          subPackets.reduce((total, subPacket) => total + subPacket.value, 0),
        ];
      case 1:
        console.log("*");
        return [
          bitsUsed,
          subPackets.reduce((total, subPacket) => total * subPacket.value, 1),
        ];
      case 2:
        console.log("min");
        return [
          bitsUsed,
          Math.min(...subPackets.map((subPacket) => subPacket.value)),
        ];
      case 3:
        console.log("max");
        return [
          bitsUsed,
          Math.max(...subPackets.map((subPacket) => subPacket.value)),
        ];
      case 5:
        console.log(">");
        return [bitsUsed, subPackets[0].value > subPackets[1].value ? 1 : 0];
      case 6:
        console.log("<");
        return [bitsUsed, subPackets[0].value < subPackets[1].value ? 1 : 0];
      case 7:
        console.log("===");
        return [bitsUsed, subPackets[0].value === subPackets[1].value ? 1 : 0];
      default:
        console.error(`${typeId} isn't a valid typeId`);
        return [bitsUsed, 0];
    }
  }

  function getSubPackets(
    shouldContinue: (bitsUsed: number) => boolean
  ): [BitsConsumed, SubPacket[]] {
    const subPackets = [];
    let bitsUsed = 0;

    while (shouldContinue(bitsUsed)) {
      const version = getVersion();
      const typeId = getTypeId();
      bitsUsed += 6;

      if (typeId === 4) {
        const [literalValue, bitsUsedForValue] = getLiteralValue();
        console.log("literal value", literalValue);
        bitsUsed += bitsUsedForValue;

        subPackets.push({
          typeId,
          value: literalValue,
          version,
        });
      } else {
        const [bitsUsedForExpression, value] = evaluateExpression(typeId);
        bitsUsed += bitsUsedForExpression;

        subPackets.push({
          typeId,
          value,
          version,
        });
      }
    }

    return [bitsUsed, subPackets];
  }

  function getSubPacketsByLength(length: number): [BitsConsumed, SubPacket[]] {
    return getSubPackets((bitsUsed) => bitsUsed < length);
  }

  function getSubPacketsByNumber(
    numberOfPackets: number
  ): [BitsConsumed, SubPacket[]] {
    let packetsConsumed = 0;
    return getSubPackets(() => packetsConsumed++ < numberOfPackets);
  }

  getVersion();
  const mainTypeId = getTypeId();
  console.log("main type id", mainTypeId);

  if (mainTypeId === 4) {
    return getLiteralValue()[0];
  }

  return evaluateExpression(mainTypeId)[1];
};

export default dayFunction;
