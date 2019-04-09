<template>
  <div id="app">
    <div
      id="field"
      :style="fieldStyle"
    >
      <template v-for="(row, i) in grid">
        <template v-for="(cell, j) in row">
          <div
            :key="i * gridWidth + j"
            :class="cellClasses(cell)"
            :style="cellStyle(i, j)"
            v-text="cell.v"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import * as Lib from '@/lib'

export default {
  name: 'app',
  data () {
    return {
      grid: Array.from(
        Lib.START_GRID,
        row => Array.from(
          row,
          ({ v, s }) => ({ v, s })
        )
      ),
      emptyCells: [
        { i: 1, j: 1 },
        { i: 1, j: 3 }
      ],
      shift: {
        to: {
          i: -1,
          j: -1
        },
        from: {
          i: -1,
          j: -1
        }
      }
    }
  },
  computed: {
    gridHeight: vm => Array.isArray(vm.grid) ? vm.grid.length : 0,
    gridWidth: vm => Array.isArray(vm.grid) && vm.grid[0] ? vm.grid[0].length : 0,
    n: vm => (i, j) => i * vm.gridWidth + j,
    shiftPx: vm => n => `${n * (Lib.CELL_SIZE + Lib.BORDER_SIZE)}px`,
    cellStyle: vm => (i, j) => ({
      top: vm.shiftPx(i),
      left: vm.shiftPx(j)
    }),
    cellClasses: vm => cell => ({
      'cell': true,
      'cell--black': !cell.v
    }),
    fieldStyle: vm => ({
      width: vm.shiftPx(vm.grid[0].length),
      height: vm.shiftPx(vm.grid.length - 1)
    })
  },
  methods: {
    up ({ i, j }) {
      if (
        this.shift.to.i === i &&
        this.shift.to.j === j &&
        this.shift.from.i === i - 1 &&
        this.shift.from.j === j
      ) return

      const toUp = this.grid[i][j]
      const toDown = this.grid[i - 1][j]

      this.$set(this.grid[i - 1], j, toUp)
      this.$set(this.grid[i], j, toDown)

      this.shift.to = { i: i - 1, j }
      this.shift.from = { i, j }
    },
    down ({ i, j }) {
      if (
        this.shift.to.i === i &&
        this.shift.to.j === j &&
        this.shift.from.i === i + 1 &&
        this.shift.from.j === j
      ) return

      const toDown = this.grid[i][j]
      const toUp = this.grid[i + 1][j]

      this.$set(this.grid[i + 1], j, toDown)
      this.$set(this.grid[i], j, toUp)

      this.shift.to = { i: i + 1, j }
      this.shift.from = { i, j }
    },
    left ({ i, j }) {
      if (
        this.shift.to.i === i &&
        this.shift.to.j === j &&
        this.shift.from.i === i &&
        this.shift.from.j === j - 1
      ) return

      const toLeft = this.grid[i][j]
      const toRight = this.grid[i][j - 1]

      this.$set(this.grid[i], j - 1, toLeft)
      this.$set(this.grid[i], j, toRight)

      this.shift.to = { i, j: j - 1 }
      this.shift.from = { i, j }
    },
    right ({ i, j }) {
      if (
        this.shift.to.i === i &&
        this.shift.to.j === j &&
        this.shift.from.i === i &&
        this.shift.from.j === j + 1
      ) return

      const toRight = this.grid[i][j]
      const toLeft = this.grid[i][j + 1]

      this.$set(this.grid[i], j + 1, toRight)
      this.$set(this.grid[i], j, toLeft)

      this.shift.to = { i, j: j + 1 }
      this.shift.from = { i, j }
    },
    isLetter (i, j) {
      const setType = this.grid[i][j].s

      return setType !== Lib.BLACK_CELL_SYMBOL && setType !== Lib.EMPTY_CELL_SYMBOL
    },
    manhattanStupid (I, J) {
      const { i, j } = this.finalCell(I, J)

      return Math.abs(I - i) + Math.abs(J - j)
    },
    manhattanStupidRandom (I, J) {
      return this.manhattanStupid(I, J) * (Math.random() * 10)
    },
    manhattanClever (I, J) {
      const { i, j } = this.finalCell(I, J)
      const additional = (i === I && j !== J) && [0, 2, 4].includes(I) ? 2 : 0

      return Math.abs(I - i) + Math.abs(J - j) + additional
    },
    manhattanCleverRandom (I, J) {
      return this.manhattanClever(I, J) * (Math.random() * 10)
    },
    finalCell (I, J) {
      const cell = this.grid[I][J]
      let i, j
      for (i = 0; i < this.gridHeight; i++) {
        for (j = 0; j < this.gridWidth; j++) {
          const target = Lib.FINISH_GRID[i][j]

          if (target.v === cell.v && target.s === cell.s) return { i, j }
        }
      }
    },
    getNeighbours ({ i, j }) {
      let neighbours = []

      if (!i) {
        if (!j) {
          if (this.isLetter(i + 1, j)) neighbours.push({ i: i + 1, j, v: 'up' })
          if (this.isLetter(i, j + 1)) neighbours.push({ i, j: j + 1, v: 'left' })
        } else if (j === this.gridWidth - 1) {
          if (this.isLetter(i + 1, j)) neighbours.push({ i: i + 1, j, v: 'up' })
          if (this.isLetter(i, j - 1)) neighbours.push({ i, j: j - 1, v: 'right' })
        } else if (j > 0 && j < this.gridWidth - 1) {
          if (this.isLetter(i + 1, j)) neighbours.push({ i: i + 1, j, v: 'up' })
          if (this.isLetter(i, j + 1)) neighbours.push({ i, j: j + 1, v: 'left' })
          if (this.isLetter(i, j - 1)) neighbours.push({ i, j: j - 1, v: 'right' })
        }
      } else if (i === this.gridHeight - 1) {
        if (!j) {
          if (this.isLetter(i - 1, j)) neighbours.push({ i: i - 1, j, v: 'down' })
          if (this.isLetter(i, j + 1)) neighbours.push({ i, j: j + 1, v: 'left' })
        } else if (j === this.gridWidth - 1) {
          if (this.isLetter(i - 1, j)) neighbours.push({ i: i - 1, j, v: 'down' })
          if (this.isLetter(i, j - 1)) neighbours.push({ i, j: j - 1, v: 'right' })
        } else if (j > 0 && j < this.gridWidth - 1) {
          if (this.isLetter(i - 1, j)) neighbours.push({ i: i - 1, j, v: 'down' })
          if (this.isLetter(i, j + 1)) neighbours.push({ i, j: j + 1, v: 'left' })
          if (this.isLetter(i, j - 1)) neighbours.push({ i, j: j - 1, v: 'right' })
        }
      } else if (i > 0 && i < this.gridHeight - 1) {
        if (!j) {
          if (this.isLetter(i - 1, j)) neighbours.push({ i: i - 1, j, v: 'down' })
          if (this.isLetter(i + 1, j)) neighbours.push({ i: i + 1, j, v: 'up' })
          if (this.isLetter(i, j + 1)) neighbours.push({ i, j: j + 1, v: 'left' })
        } else if (j === this.gridWidth - 1) {
          if (this.isLetter(i - 1, j)) neighbours.push({ i: i - 1, j, v: 'down' })
          if (this.isLetter(i + 1, j)) neighbours.push({ i: i + 1, j, v: 'up' })
          if (this.isLetter(i, j - 1)) neighbours.push({ i, j: j - 1, v: 'right' })
        } else if (j > 0 && j < this.gridWidth - 1) {
          if (this.isLetter(i - 1, j)) neighbours.push({ i: i - 1, j, v: 'down' })
          if (this.isLetter(i + 1, j)) neighbours.push({ i: i + 1, j, v: 'up' })
          if (this.isLetter(i, j + 1)) neighbours.push({ i, j: j + 1, v: 'left' })
          if (this.isLetter(i, j - 1)) neighbours.push({ i, j: j - 1, v: 'right' })
        }
      }

      return neighbours
    },
    heuristic ({ i, j }) {
      return this.manhattanStupidRandom(i, j) - 1
    },
    getCandidates () {
      return Array.from(new Set(this.emptyCells
        .map(emptyCell => this.getNeighbours(emptyCell))
        .reduce((a, b) => [...a, ...b], [])
      ))
    },
    findEmptyCells () {
      let emptyCells = []

      for (let i = 0; i < this.gridHeight; i++) {
        for (let j = 0; j < this.gridWidth; j++) {
          if (this.grid[i][j].s === Lib.EMPTY_CELL_SYMBOL) {
            emptyCells.push({ i, j })
          }
        }
      }

      this.emptyCells = emptyCells
    },
    isFinishGrid () {
      return Lib.areGridsEqual(this.grid, Lib.FINISH_GRID)
    },
    async start () {
      try {
        while (!this.isFinishGrid()) {
          const candidates = this.getCandidates()
          const hValues = candidates.map(v => this.heuristic(v))

          const cellToMove = candidates[hValues.indexOf(Math.min(...hValues))]
          this[cellToMove.v](cellToMove)
          this.findEmptyCells()
          await Lib.pause()
        }
      } catch (e) {
        alert(e)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';
@import url('https://fonts.googleapis.com/css?family=Comfortaa&subset=cyrillic');

#app {
  color: $clr;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#field {
  position: relative
}

.cell {
  transition: .4s ease-in-out;
  border: $border-size-px solid $clr;
  position: absolute;
  width: $cell-size-px;
  height: $cell-size-px;
  text-transform: lowercase;
  text-align: center;
  font: 100 #{0.45 * $cell-size-px}/$cell-size-px Comfortaa, sans-serif;
  &--black {
    background-color: $clr;
  }
}
</style>
