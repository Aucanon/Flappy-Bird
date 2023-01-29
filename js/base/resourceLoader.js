import { Resources } from './resource'
import Databus from '../databus'
const databus = new Databus()

export default class ResourceLoader {
  constructor () {
    this.srcs = Resources
    this.maxCount = Object.keys(this.srcs).length
    this.count = 0
    this.loadResources()
  }
  loadResources () {
    // 存储所有图片对象 
    // 创建图片对象
    // 给图片对象src赋值
    // 图片加载完成进行游戏下一步
    for (var k in this.srcs) {
      databus.imgObj[k] = wx.createImage()
      databus.imgObj[k].src = this.srcs[k]
      databus.imgObj[k].onload = () => {
        // 判断是否所有图片加载完成
        this.count++
        if (this.count >= this.maxCount) {
          databus.load = true
        }
      }
    }
  }
}