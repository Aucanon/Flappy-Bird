import ResourceLoader from './base/resourceLoader'
import Databus from './databus'
import Background from './runtime/background'
import Land from './runtime/land'
import Pipe from './runtime/pipe'
import Bird from './player/bird'
import Score from './player/score'
import Over from './player/over'
import Panel from './player/panel'
const databus = new Databus()

wx.setPreferredFramesPerSecond(30)

export default class Main {
  constructor () {
    // 获取canvas画布和绘图上下文
    this.canvas = wx.createCanvas()
    this.ctx = this.canvas.getContext('2d')
    this.aniId = 0
    databus.canvas = this.canvas
    databus.ctx = this.ctx
    this.resource = new ResourceLoader()
    this.status = false
    this.loop()
    this.bindEvent()
  }
  init () {
    if (this.status) return
    this.status = true
    databus.reset()
    this.bg = new Background()
    this.land = new Land()
    this.bg.render()
    this.land.render()
    this.bird = new Bird()
    this.score = new Score()
    this.over = null
  }
  update () {
    // 每次重新绘制
    databus.ctx.clearRect(0, 0, databus.canvas.width, databus.canvas.height)
    // this.bg.update()
    // this.bg.render()
    // this.land.update()
    // this.land.render()
    databus.actors.forEach(value => {
      value.update()
      value.render()
    })
    this.score.render()
  }
  loop () {
    // 开启定时器
    requestAnimationFrame(() => {
      // 判断图片加载是否完成
      if (databus.load) {
        // 进行场景判断
        if (databus.scene === 0) {
          // 初始化
          this.init()
        } else if (databus.scene === 1) {
          // 每100帧添加pipe
          if (this.aniId % 100 === 0) {
            const pipe = new Pipe()
          }
        } else if (databus.scene === 2) {
          databus.speed = 0
          databus.bird.wing = 0
          databus.bird.rotate = Math.PI / 2
          if (!this.over) {
            this.over = new Over()
            this.panel = new Panel()
          }
          if (databus.score > databus.best) {
            databus.best = databus.score
          }
        }        
        this.update()
        this.aniId++
      }
      this.loop()
    })
  }
  bindEvent () {
    wx.onTouchStart((result) => {
      if (databus.scene === 0) {
        this.bird.bindFly()
        databus.scene = 1
      } else if (databus.scene === 1) {
        this.bird.bindFly()
      } else if (databus.scene === 2) {
        databus.scene = 0
        this.status = false
      } 
    })
  }
}