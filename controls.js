export default class Controls {
  constructor(type) {
    this.forward = false
    this.left = false
    this.right = false
    this.reverse = false

    switch (type) {
      case 'MAIN':
        return this.#addKeyboardListeners()
      case 'DUMMY':
        return this.forward = true
    }
  }

  #addKeyboardListeners() {
    // KEY DOWN
    document.onkeydown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          return this.left = true
        case 'ArrowRight':
          return this.right = true
        case 'ArrowUp':
          return this.forward = true
        case 'ArrowDown':
          return this.reverse = true
      }
    }
    // KEY UP
    document.onkeyup = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          return this.left = false
        case 'ArrowRight':
          return this.right = false
        case 'ArrowUp':
          return this.forward = false
        case 'ArrowDown':
          return this.reverse = false
      }
    }
  }
}