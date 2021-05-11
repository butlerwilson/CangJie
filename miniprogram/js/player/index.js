import Sprite from '../base/sprite'
import Bullet from './bullet'
import DataBus from '../databus'
import Block from '../npc/block'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH = 80
const PLAYER_HEIGHT = 80

const databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight - this.height - 30

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    this.bullets = []
    this.collide_blocks = [];
    this.line = [[0, 0], [0, 0]];

    // 初始化事件监听
    this.initEvent()
  }

  addDot(x, y) {
    const end = this.line.pop();
    this.line.push([x, y]);
    this.line.push(end);
  }

  end() {
    return this.line[this.line.length - 1];
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation)
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if (disX < 0) disX = 0

    else if (disX > screenWidth - this.width) disX = screenWidth - this.width

    if (disY <= 0) disY = 0

    else if (disY > screenHeight - this.height) disY = screenHeight - this.height

    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      // 记录触摸点坐标
      this.line = [[x, y], [x, y]];
      this.collide_blocks = [];

      this.touched = true

    }))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      const l = this.line.length;

      this.line[l - 1][0] = x;
      this.line[l - 1][1] = y;

      // if (this.touched) this.setAirPosAcrossFingerPosZ(x, y)
    }))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      var ans = Block.judgeBlocks(this.collide_blocks).then(res => {
        console.log(res);
        if (res.length) databus.removeUnmoveBlock();
        else {
          for (var i = 0; i < this.collide_blocks.length; ++i) {
            this.collide_blocks[i].movable = true;
          }
        }
      });
      this.line = [[0, 0], [0, 0]]
      this.touched = false
    }))
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    const bullet = databus.pool.getItemByClass('bullet', Bullet)

    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      10
    )

    databus.bullets.push(bullet)
  }
  drawToCanvas(ctx) {
    ctx.beginPath();
    for (var i = 0; i < this.line.length - 1; ++i) {
      const startX = this.line[i][0], startY = this.line[i][1];
      const endX = this.line[i + 1][0], endY = this.line[i + 1][1];
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
    ctx.stroke();
    // console.log(this.startX+','+this.startY+','+this.endX+','+this.endY)
  }
}
