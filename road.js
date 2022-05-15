import { lerp } from "./ulits.js"

export default class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x
    this.width = width
    this.laneCount = laneCount

    this.left = x - width / 2
    this.right = x + width / 2

    const infinity = 1000000
    this.top = -infinity
    this.bottom = infinity
  }

  // DRAW LINES
  draw(ctx) {
    ctx.lineWidth = 5
    ctx.strokeStyle = 'white'

    // x positions for lines inside
    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(
        this.left,
        this.right,
        i / this.laneCount

      )
      if (i > 0 && i < this.laneCount) {
        // dashes for inside lines
        ctx.setLineDash([20, 20])
      } else {
        // straight lines for outside
        ctx.setLineDash([])
      }
      ctx.beginPath()
      ctx.moveTo(x, this.top)
      ctx.lineTo(x, this.bottom)
      ctx.stroke()
    }
  }
}
