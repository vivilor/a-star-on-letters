import Variables from '@/styles/variables.scss'

export const NIL = ''

export const BLACK_CELL_SYMBOL = Symbol('Black cell')
export const EMPTY_CELL_SYMBOL = Symbol('Empty cell')
export const FIRST_LETTER_SET_SYMBOL = Symbol('First letter set')
export const SECOND_LETTER_SET_SYMBOL = Symbol('Second letter set')

export const BORDER_SIZE = parseInt(Variables['borderSize'])
export const CELL_SIZE = parseInt(Variables['cellSize'])

export const START_GRID = [
  [
    { v: 'к', s: FIRST_LETTER_SET_SYMBOL },
    { v: 'и', s: FIRST_LETTER_SET_SYMBOL },
    { v: 'р', s: FIRST_LETTER_SET_SYMBOL },
    { v: 'о', s: FIRST_LETTER_SET_SYMBOL },
    { v: 'в', s: FIRST_LETTER_SET_SYMBOL }
  ],
  [
    { v: NIL, s: BLACK_CELL_SYMBOL },
    { v: ' ', s: EMPTY_CELL_SYMBOL },
    { v: NIL, s: BLACK_CELL_SYMBOL },
    { v: ' ', s: EMPTY_CELL_SYMBOL },
    { v: NIL, s: BLACK_CELL_SYMBOL }
  ],
  [
    { v: 'в', s: SECOND_LETTER_SET_SYMBOL },
    { v: 'я', s: SECOND_LETTER_SET_SYMBOL },
    { v: 'т', s: SECOND_LETTER_SET_SYMBOL },
    { v: 'к', s: SECOND_LETTER_SET_SYMBOL },
    { v: 'а', s: SECOND_LETTER_SET_SYMBOL }
  ]
]

export const FINISH_GRID = [
  [
    { v: 'в', s: SECOND_LETTER_SET_SYMBOL },
    { v: 'я', s: SECOND_LETTER_SET_SYMBOL },
    { v: 'т', s: SECOND_LETTER_SET_SYMBOL },
    { v: 'к', s: SECOND_LETTER_SET_SYMBOL },
    { v: 'а', s: SECOND_LETTER_SET_SYMBOL }
  ],
  [
    { v: NIL, s: BLACK_CELL_SYMBOL },
    { v: ' ', s: EMPTY_CELL_SYMBOL },
    { v: NIL, s: BLACK_CELL_SYMBOL },
    { v: ' ', s: EMPTY_CELL_SYMBOL },
    { v: NIL, s: BLACK_CELL_SYMBOL }
  ],
  [
    { v: 'к', s: FIRST_LETTER_SET_SYMBOL },
    { v: 'и', s: FIRST_LETTER_SET_SYMBOL },
    { v: 'р', s: FIRST_LETTER_SET_SYMBOL },
    { v: 'о', s: FIRST_LETTER_SET_SYMBOL },
    { v: 'в', s: FIRST_LETTER_SET_SYMBOL }
  ]
]

const areCellsEqual = (cellA, cellB) => cellA.v === cellB.v && cellA.s === cellB.s

export function areGridsEqual (gridA, gridB) {
  for (let i = 0; i < gridA.length; i++) {
    for (let j = 0; j < gridA[0].length; j++) {
      if (!areCellsEqual(gridA[i][j], gridB[i][j])) return false
    }
  }
  return true
}

// eslint-disable-next-line no-unused-vars
let timer = null
let delay = 500

export async function pause () {
  return new Promise(resolve => { timer = setTimeout(resolve, delay) })
}
