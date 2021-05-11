const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const close_button = new Image()
close_button.src = 'images/close.png'

export default class GameEnd{
  renderGameEnd(ctx){
    ctx.drawImage(close_button, 20, 20, 30, 30)
    // canvas.addEventListener('')
  }
}