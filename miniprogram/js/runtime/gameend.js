import { listeners } from "../libs/listener"

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const close_button = new Image()
close_button.src = 'images/close.png'

export default class GameEnd{
  constructor() {
    this.closeBtnArea = {
      startX: 20,
      startY: 20,
      endX: 30,
      endY: 30
    }
    canvas.addEventListener('touchstart', listeners.stopGame);
  }

  renderGameEnd(ctx){
    ctx.drawImage(close_button, 20, 20, 30, 30)
  }

  
}