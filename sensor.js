import { lerp } from "./ulits.js"

export default class Sensor {
  constructor(car) {
    this.car = car
    this.rayCount = 3
    this.rayLength = 100
    this.raySpread = Math.PI / 4 // 45°

    this.rays = []

  }

  update() {
    this.rays = []

    // CREATE RAY
    // count angle
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(this.raySpread / 2, -this.raySpread / 2, i / (this.rayCount - 1))

      // get  start and end point
      const start = { x: this.car.x, y: this.car.y }
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength
      }

      // add to array
      this.rays.push([start, end])
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'yellow'
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y) // from start point of each ray
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y) // to end point
      ctx.stroke()
    }
  }
}