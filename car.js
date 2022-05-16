import Controls from "./controls.js"
import Sensor from "./sensor.js"
import { polysIntersect } from "./utilitis.js"

export default class Car {
  constructor(x, y, width, height, type, maxSpeed = 5) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.speed = 0
    this.acceleration = 0.3
    this.maxSpeed = maxSpeed
    this.friction = 0.1
    this.angle = 0
    this.damaged = false

    this.sensor = new Sensor(this) // pass car itself
    this.controls = new Controls(type)
  }

  update(roadBorders) {
    if (!this.damaged) {
      this.#move()
      this.polygon = this.#createPolygon()
      this.damaged = this.#assessDamage(roadBorders)
    }
    this.sensor.update(roadBorders)
  }

  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true
      }
    }
    return false
  }

  // CAR CORNERS
  #createPolygon() {
    const points = []
    const rad = Math.hypot(this.width, this.height) / 2
    const alpha = Math.atan2(this.width, this.height)

    points.push({
      // top right point
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    })
    points.push({
      // top left point
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    })
    points.push({
      // bottom right point
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    })
    points.push({
      // bottom left point
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    })
    return points
  }

  #move() {
    // acceleration
    if (this.controls.forward) this.speed += this.acceleration
    if (this.controls.reverse) this.speed -= this.acceleration

    // speed limits
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed
    if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2

    // slowing down
    if (this.speed > 0) this.speed -= this.friction
    if (this.speed < 0) this.speed += this.friction
    if (Math.abs(this.speed) < this.friction) this.speed = 0

    // turn left/right
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1 //flip changes turn side when reversing
      if (this.controls.left) this.angle += 0.03 * flip
      if (this.controls.right) this.angle -= 0.03 * flip
    }

    // update position
    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed
  }

  draw(ctx) {
    if (this.damaged) {
      ctx.fillStyle = 'red'
    } else {
      ctx.fillStyle = 'black'
    }
    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
    }
    ctx.fill()
    this.sensor.draw(ctx)
  }
}