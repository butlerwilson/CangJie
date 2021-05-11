import { listeners } from '../libs/listener'

const startPageCanvas = wx.createCanvas("start_page")
const startPageCtx = startPageCanvas.getContext('2d')
const screenCanvasCtx = canvas.getContext('2d')


export default class StartPage{
  constructor(){
    this.begin();
  }
  begin(){
    console.log("begin in startpage", startPageCtx)
    startPageCtx.fillStyle = 'red'
    startPageCtx.fillRect(0, 0, 100, 100)
    startPageCtx.fillRect(100,100,200,200)
    screenCanvasCtx.drawImage(startPageCanvas, 0, 0);
    canvas.addEventListener('touchstart', listeners.startMainGame)
  }
}