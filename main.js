import Car from "./car.js"

const canvas = document.querySelector('#Canvas')
canvas.width = 200

const ctx = canvas.getContext('2d')
const car = new Car(100, 400, 30, 50)

animate()

function animate() {
  canvas.height = window.innerHeight //clears canvas on refresh
  car.update()
  car.draw(ctx)
  requestAnimationFrame(animate)
}