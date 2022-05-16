import Car from "./car.js"
import Road from "./road.js"

const canvas = document.querySelector('#Canvas')
canvas.width = 200

const ctx = canvas.getContext('2d')
const road = new Road(canvas.width / 2, canvas.width * 0.9)
const car = new Car(road.getLaneCenter(1), 400, 30, 50, 'KEYS')

const traffic = [
  new Car(road.getLaneCenter(1), 100, 30, 50, 'DUMMY', 2)
]

animate()

function animate() {
  traffic.map((car, i) => {
    traffic[i].update(road.borders)
  })
  canvas.height = window.innerHeight //clears canvas on refresh

  car.update(road.borders)

  ctx.save()
  ctx.translate(0, -car.y + canvas.height * 0.8)

  road.draw(ctx)
  traffic.map((car, i) => {
    traffic[i].draw(ctx)
  })
  car.draw(ctx)

  ctx.restore()

  requestAnimationFrame(animate)
}