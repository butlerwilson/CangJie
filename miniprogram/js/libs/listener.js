import Main from '../main'
import GameEnd from '../runtime/gameend'
import StartPage from '../runpage/startpage'

const startMainGame = (e) => {
  e.preventDefault()

  const x = e.touches[0].clientX
  const y = e.touches[0].clientY

  const area = {
    startX: 100,
    startY: 100,
    endX: 300,
    endY: 300
  }
  if (x >= area.startX
    && x <= area.endX
    && y >= area.startY
    && y <= area.endY) {
      // 进入到游戏界面
      console.log(x)
      new Main()
      console.log("after new main()")
    }
}

const stopGame = (e) => {
  e.preventDefault();
  
  console.log("stop game");

  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;

  const area = {
    startX: 20,
    startY: 20,
    endX: 50,
    endY: 50
  }

  if (x >= area.startX
    && x <= area.endX
    && y >= area.startY
    && y <= area.endY) {
      // 返回到主界面
      console.log("stop game if");
      Main.stop();
      new StartPage().begin();
      // 排除 Main touchstart 的影响
    }

}

module.exports.listeners = {
  startMainGame: startMainGame,
  stopGame: stopGame
}
