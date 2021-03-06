import { lerp, getIntersection } from "./utilitis.js"

export default class Sensor {
  constructor(car) {
    this.car = car
    this.rayCount = 5
    this.rayLength = 150
    this.raySpread = Math.PI / 2 // 45°

    this.rays = []
    this.readings = []
  }

  update(roadBorders, traffic) {
    this.#castRays()
    this.readings = []
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic))
    }
  }

  #getReading(ray, rayBorders, traffic) {
    let touches = []

    for (let i = 0; i < rayBorders.length; i++) {
      const touch = getIntersection(ray[0], ray[1], rayBorders[i][0], rayBorders[i][1])
      if (touch) {
        touches.push(touch)
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(ray[0], ray[1], poly[j], poly[(j + 1) % poly.length])
        value && touches.push(value)
      }
    }

    if (touches.length === 0) {
      return null
    } else {
      const offsets = touches.map(e => e.offset)
      const minOffset = Math.min(...offsets)
      return touches.find(e => e.offset === minOffset)
    }
  }

  #castRays() {
    this.rays = []

    // CREATE RAY
    // count angle
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)) + this.car.angle // this.car.angle changes so rays move with a car

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
    // DRAW EACH RAY
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1] // endpoint of ray
      if (this.readings[i]) {
        end = this.readings[i] // set end of ray to touching point of ray and border
      }

      // RAY ON THE ROAD
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'yellow'
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y) // from start point of each ray
      ctx.lineTo(end.x, end.y) // to end point
      ctx.stroke()

      // RAY OUT OF THE ROAD
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'red'
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y) // start from point where ray touches border
      ctx.lineTo(end.x, end.y) // to end point
      ctx.stroke()
    }
  }
}