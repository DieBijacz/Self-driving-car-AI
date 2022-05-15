import Controls from "./controls.js"
import Sensor from "./sensor.js"

export default class Car {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.speed = 0
    this.acceleration = 0.3
    this.maxSpeed = 5
    this.friction = 0.1
    this.angle = 0

    this.sensor = new Sensor(this) // pass car itself
    this.controls = new Controls()
  }

  update() {
    this.#move()
    this.sensor.update()
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
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(-this.angle)

    ctx.beginPath()
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height) // constructor(x, y, width, height)

    ctx.fill()
    ctx.restore()

    this.sensor.draw(ctx)
  }
}