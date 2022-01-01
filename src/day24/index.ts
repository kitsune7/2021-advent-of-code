import { DayFunction } from '../utilities'

type Variable = 'w' | 'x' | 'y' | 'z'
type State = Record<Variable, number> & { inputs: number[] }

const dayFunction: DayFunction = (instructions: string[]) => {
  const variables = ['w', 'x', 'y', 'z']
  const commandToFunction = {
    add: add,
    mul: mul,
    div: div,
    mod: mod,
    eql: eql,
  }

  function inp(state: State, a: Variable) {
    state[a] = state.inputs.pop()
  }

  function evaluate(state: State, data: string): number {
    if (variables.includes(data)) {
      return state[data]
    }
    return Number(data)
  }

  function add(state: State, a: Variable, b: string) {
    state[a] = state[a] + evaluate(state, b)
  }

  function mul(state: State, a: Variable, b: string) {
    state[a] = state[a] * evaluate(state, b)
  }

  function div(state: State, a: Variable, b: string) {
    state[a] = Math.floor(state[a] / evaluate(state, b))
  }

  function mod(state: State, a: Variable, b: string) {
    state[a] = state[a] % evaluate(state, b)
  }

  function eql(state: State, a: Variable, b: string) {
    state[a] = state[a] === evaluate(state, b) ? 1 : 0
  }

  function isValidModelNumber(modelNumber: number): boolean {
    const modelNumberInputs = modelNumber.toString().split('').map(Number)

    if (modelNumberInputs.length !== 14 || modelNumberInputs.some((num) => num === 0)) {
      return false
    }

    const state: State = {
      inputs: modelNumberInputs.reverse(),
      w: 0,
      x: 0,
      y: 0,
      z: 0,
    }

    for (let i = 0; i < instructions.length; i++) {
      runInstruction(instructions[i], state)
    }

    return !state.z
  }

  function runInstruction(instruction: string, state: State) {
    if (instruction.startsWith('inp')) {
      inp(state, instruction.split(' ')[1] as Variable)
    } else {
      const [command, a, b] = instruction.split(' ')
      commandToFunction[command](state, a, b)
    }
  }

  for (let modelNumber = 99999999999999; modelNumber >= 11111111111111; modelNumber--) {
    let modelNumberString = modelNumber.toString()
    if (modelNumberString.includes('0')) {
      modelNumberString.replace(/0/g, '9')
      continue
    }

    if (isValidModelNumber(modelNumber)) {
      return modelNumber
    }
  }

  return 11111111111111
}

export default dayFunction
