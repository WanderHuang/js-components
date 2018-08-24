;(function(window, undefined) {
  function initTaichi(tc) {
    let dom = document.querySelector(tc.options.el)
    if (!dom) {
      throw new Error('illeagal dom element, and tc fail to mount')
    } else {
      let frag = document.createDocumentFragment()
      let subDomCount = 2
      while(subDomCount-- > 0) {
        frag.appendChild(document.createElement('div'))
      }

      dom.appendChild(frag)
      dom.className = 'taichi'
      // animation: clockwise 3s ease infinite
      dom.style.cssText = `width: ${tc.options.size}px; height: ${tc.options.size}px; animation: ${tc.options.animation}`
    }
  }

  /**
   * 定义一个太极图对象
   * @param {Object} options 
   */
  function Taichi (options) {
    this.options = options
    initTaichi(this)
  }

  // 配置
  let TaichiConf = {}
  TaichiConf.CLOCKWISE='clockwise'
  TaichiConf.ANTICLOCKWISE='anticlockwise'
  TaichiConf.NONE=''

  window.Taichi = window.Taichi || Taichi
  window.TaichiConf = window.TaichiConf || TaichiConf
}(window))