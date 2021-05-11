import { listeners } from '../libs/listener'

const startPageCanvas = wx.createCanvas("start_page")
const startPageCtx = startPageCanvas.getContext('2d')
const screenCanvasCtx = canvas.getContext('2d')

var instance = null;

export default class StartPage{
  constructor(){
    if (instance) {
      canvas.removeEventListener(
        'touchstart',
        listeners.stopGame
      );
      return instance;
    }
    instance = this;
    this.begin();
  }
  begin(){
    console.log("begin in startpage", startPageCtx);
    // 清屏
    screenCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    startPageCtx.clearRect(0, 0, canvas.width, canvas.height);
    startPageCtx.fillStyle = 'red'
    startPageCtx.fillRect(0, 0, 100, 100)
    startPageCtx.fillRect(100,100,200,200)
    screenCanvasCtx.drawImage(startPageCanvas, 0, 0);
    canvas.addEventListener('touchstart', listeners.startMainGame)
  }
}