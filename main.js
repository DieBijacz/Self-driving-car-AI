import Car from "./car.js"
import Road from "./road.js"
import { Visualizer } from "./visualizer.js"

const carCanvas = document.querySelector('#carCanvas')
const networkCanvas = document.querySelector('#networkCanvas')
carCanvas.width = 200
networkCanvas.width = 300

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
const car = new Car(road.getLaneCenter(1), 400, 30, 50, 'AI')

const traffic = [
  new Car(road.getLaneCenter(1), 100, 30, 50, 'DUMMY', 1)
]

animate()

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, [])
  }
  carCanvas.height = window.innerHeight //clears canvas on refresh
  networkCanvas.height = window.innerHeight //clears canvas on refresh

  car.update(road.borders, traffic)

  carCtx.save()
  carCtx.translate(0, -car.y + carCanvas.height * 0.8)

  road.draw(carCtx)
  traffic.map((car, i) => {
    traffic[i].draw(carCtx, '#16A085')
  })
  car.draw(carCtx, '#34495E')

  carCtx.restore()


  networkCtx.lineDashOffset = -time / 50
  Visualizer.drawNetwork(networkCtx, car.brain)
  requestAnimationFrame(animate)
}