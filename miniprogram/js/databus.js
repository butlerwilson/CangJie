import Pool from './base/pool'

let instance

const __ = {
  charList: Symbol('charList'),
  ansList: Symbol('ansList')
}


/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  async reset() {
    await this.refreshList()
    this.frame = 0
    this.score = 0
    this.bullets = []
    this.blocks = []
    this.enemys = []
    this.animations = []
    this.gameOver = false
  }

  async refreshList() {
    let _this = this
    let res = await wx.cloud.callFunction({
      name: "charList",
      data: {
        size: 100
      }
    })
    let clist=res.result.char_list
    let alist=res.result.ans_list
    _this[__.charList] = clist
    _this[__.ansList] = alist
    // console.log("charList sucess!", res)
    console.log("charList sucess!", clist)
    console.log("ansList sucess!", alist)
  }

  getCharList() {
    return this[__.charList]
  }

  getAnsList() {
    return this[__.ansList]
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    const temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    const temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }

  removeBlocks(block) {
    this.blocks.sort((x, y) => {return y.y - x.y})
    const temp = this.blocks.shift()

    temp.visible = false

    this.pool.recover('block', block)
  }

  removeUnmoveBlock() {
    for (var i = 0; i < this.blocks.length; ) {
      if (!this.blocks[i].movable) {
        this.blocks[i].visible = false;
        this.pool.recover('block', this.blocks[i]);
        this.blocks.splice(i, 1);
      } else {
        ++i;
      }
    }
  }


}
