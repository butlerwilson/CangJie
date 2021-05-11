import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import GameEnd from './runtime/gameend'
import Music from './runtime/music'
import DataBus from './databus'
import Block from './npc/block'
import {BLOCK_WIDTH, BLOCK_HEIGHT} from './npc/block'
import { listeners } from './libs/listener'

wx.cloud.init({
  env:"cloud1-7g5rittif1dd74f6"//你的环境ID
})

const ctx = canvas.getContext('2d')
const databus = new DataBus()
// ctx.fillStyle = "white";
// ctx.fillRect(0,0,100,100);


/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    canvas.removeEventListener(
      'touchstart',
      listeners.startMainGame
    )
    this.aniId = 0
    this.restart()
  }

  restart() {
    databus.reset().then(res => {
      canvas.removeEventListener(
        'touchstart',
        this.touchHandler
      )
  
      this.bg = new BackGround(ctx)
      this.player = new Player(ctx)
      this.gameinfo = new GameInfo()
      this.gameend = new GameEnd()
      this.music = new Music()
  
      this.bindLoop = this.loop.bind(this)
      this.hasEventBind = false
  
      // 清除上一局的动画
      window.cancelAnimationFrame(this.aniId)
  
      this.aniId = window.requestAnimationFrame(
        this.bindLoop,
        canvas
      )
    })

    // canvas.removeEventListener(
    //   'touchstart',
    //   this.touchHandler
    // )

    // this.bg = new BackGround(ctx)
    // this.player = new Player(ctx)
    // this.gameinfo = new GameInfo()
    // this.music = new Music()

    // this.bindLoop = this.loop.bind(this)
    // this.hasEventBind = false

    // // 清除上一局的动画
    // window.cancelAnimationFrame(this.aniId)

    // this.aniId = window.requestAnimationFrame(
    //   this.bindLoop,
    //   canvas
    // )
  }

  blockGenerate() {
    if (databus.frame % 60 === 0) {
      const block = databus.pool.getItemByClass('block', Block)
      block.init()
      databus.blocks.push(block)
    }
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      const enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    const that = this

    databus.blocks.forEach((block) => {
      // console.log("x: ", block.x, "y: ", block.y)
      // console.log("x: ", that.player.endX, "y: ", that.player.endY)
     // console.log("hi")
      if (!that.player.touched) return;
     // console.log(block.x + BLOCK_WIDTH >= that.player.endX);
      const endX = that.player.end()[0], endY = that.player.end()[1];
      if (!!(block.x + BLOCK_WIDTH >= endX && 
          block.y + BLOCK_HEIGHT >= endY &&
          endX >= block.x &&
          endY >= block.y) && block.movable) {
            block.movable = false;
            const centerX = block.x + BLOCK_WIDTH / 2;
            const centerY = block.y + BLOCK_HEIGHT / 2;
            that.player.addDot(centerX, centerY);
            that.player.collide_blocks.push(block);
          }
    })

    // databus.bullets.forEach((bullet) => {
    //   for (let i = 0, il = databus.enemys.length; i < il; i++) {
    //     const enemy = databus.enemys[i]

    //     if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
    //       enemy.playAnimation()
    //       that.music.playExplosion()

    //       bullet.visible = false
    //       databus.score += 1

    //       break
    //     }
    //   }
    // })

    // for (let i = 0, il = databus.enemys.length; i < il; i++) {
    //   const enemy = databus.enemys[i]

    //   if (this.player.isCollideWith(enemy)) {
    //     databus.gameOver = true

    //     break
    //   }
    // }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    const area = this.gameinfo.btnArea

    if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY) this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    // databus.bullets
    //   .concat(databus.enemys)
    //   .forEach((item) => {
    //     item.drawToCanvas(ctx)
    //   })

    databus.blocks.forEach((item) => {
          item.drawToCanvas(ctx)
        })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)
    this.gameend.renderGameEnd(ctx)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver) return

    this.bg.update()

    // databus.bullets
    //   .concat(databus.enemys)
    //   .forEach((item) => {
    //     item.update()
    //   })

    databus.blocks.forEach((item) => {
      item.update()
    })

    this.blockGenerate()

    // this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % 20 === 0) {
      this.player.shoot()
      // this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
