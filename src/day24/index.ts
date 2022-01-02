import { DayFunction } from '../utilities'

const dayFunction: DayFunction = (instructions: string[]) => {
  /*
   * There's a set of 18 instructions for every digit. The commands are the same in every set except for 3 numbers.
   *
   * The instructions basically make z act like a stack in base 26. If the fifth line of an instruction set uses 1, z
   * doesn't grow smaller, so it's essentially a push. If z uses 26 on that line, it pops off the last base 26 digit.
   *
   * I think x can be ignored except on pop instruction sets. In those circumstances, `x - some integer` needs to be equal
   * to the last z digit, which should be equal to a digit from the model number + the integer added to y in the instruction
   * set where the value at the top of the stack was added. Knowing this, we determine a set of constraints that model
   * numbers need to meet and then we can just find the highest model number that matches those constraints! :D
   */
  const numberOfInputs = 14
  const instructionSetLength = 18
  const instructionSets = Array(numberOfInputs)

  for (let i = 0; i < instructions.length / instructionSetLength; i++) {
    instructionSets[i] = instructions.slice(
      i * instructionSetLength,
      (i + 1) * instructionSetLength
    )
  }

  const simplifiedInstructionData = instructionSets.map((instructionSet) => [
    Number(instructionSet[4].split(' ').pop()), // Either 1 or 26
    Number(instructionSet[5].split(' ').pop()), // An integer constant added to x
    Number(instructionSet[15].split(' ').pop()), // An integer constant added to y
  ])

  const stack = []
  let highestModelNumber = '11111111111111'
  simplifiedInstructionData.forEach((data, i) => {
    if (data[0] === 1) {
      console.log(`Push i${i} + ${data[2]}`)
      stack.push([i, data[2]])
    } else {
      const popped = stack.pop()
      const reducedOperand = popped[1] + data[1]

      if (reducedOperand > 0) {
        highestModelNumber =
          highestModelNumber.slice(0, i) +
          (1 + reducedOperand).toString() +
          highestModelNumber.slice(i + 1)
      } else if (reducedOperand < 0) {
        highestModelNumber =
          highestModelNumber.slice(0, popped[0]) +
          (1 - reducedOperand).toString() +
          highestModelNumber.slice(popped[0] + 1)
      }

      console.log(
        `Pop i${popped[0]} from stack. i${i} == i${popped[0]} + ${popped[1]} + (${data[1]}) == i${
          popped[0]
        } + ${reducedOperand < 0 ? `(${reducedOperand})` : reducedOperand}`
      )
    }
  })

  return Number(highestModelNumber)
}

export default dayFunction

/*

i4 = i3 + 3
i5 = i2 - 4
i7 = i6 - 6
i9 = i8 + 5
i11 = i10 + 2
i12 = i1 + 7
i13 = i0 - 7

99695934979

*/
