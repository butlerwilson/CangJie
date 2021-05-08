import Animation from '../base/animation'
import DataBus from '../databus'

const BLOCK_IMG_SRC = 'images/111.png'
const BLOCK_WIDTH = 30
const BLOCK_HEIGHT = 10

module.exports.BLOCK_WIDTH = BLOCK_WIDTH;
module.exports.BLOCK_HEIGHT = BLOCK_HEIGHT;

let char_list_idx = 0
let char_list
let ans_list
let refreshed

const __ = {
  speed: Symbol('speed')
}

const databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Block extends Animation {
  constructor() {
    super(BLOCK_IMG_SRC, BLOCK_WIDTH, BLOCK_HEIGHT)
    char_list = databus.getCharList()
    ans_list = databus.getAnsList()
    refreshed = false
  }

  randomSpeed() {
    return rnd(1, 3)
  }

  init() {
    this.index = char_list_idx++
    if (char_list_idx > char_list.length - 50 && !refreshed) {
      databus.refreshList()
      refreshed = true
    } else if (char_list_idx <= char_list.length - 50) {
      refreshed = false
    }
    if (char_list.length <= this.index) {
      char_list = databus.getCharList()
      ans_list = databus.getAnsList()
      char_list_idx = 0
      this.init()
      return
    }
    this.char = char_list[this.index]
    console.log(this.char)
    this.x = rnd(0, window.innerWidth - BLOCK_WIDTH)
    this.y = -this.height

    this[__.speed] = this.randomSpeed()

    this.visible = true
    this.movable = true
  }

  // 每一帧更新子弹位置
  update() {
    if(this.movable) this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height) databus.removeBlocks(this)
  }

  static async judgeBlocks(blocks) {
    let id = null;
    let cloud = false;
    for (var i = 0; i < blocks.length; ++i) {
      if (id === null) id = blocks[i].char['ans_index'];
      if (blocks[i].char['ans_index'] != id) {
        cloud = true;
        break;
      }
    }
    if (!cloud) {
      if (ans_list[id]['ans'].length == blocks.length) {
        return ans_list[id]['char'];
      }
    }
    var c_list = [];
    blocks.forEach((block) => {
      c_list.push(block.char['char'])
    })
    console.log(c_list);
    var res = await wx.cloud.callFunction({
      name: "validate",
      data: {
          char_list: c_list // 多个部首所组成的数组
      }
    });
    console.log(res);
    if (!res) return null;
    var result = [];
    res.result.data.forEach(r => {
      result.push(r.key);
    })
    return result;
  }

  // 重载
  drawToCanvas(ctx) {
    if (!this.visible) return

    // ctx.drawImage(
    //   this.img,
    //   this.x,
    //   this.y,
    //   this.width,
    //   this.height
    // )

    ctx.font = "30px Arial"
    ctx.fillText(
      this.char['char'],
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
