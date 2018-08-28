;(function(window, undefined) {
  let roughArray = []
  let shapeArray = ['star', 'tria']

  /**
   * 创建随机数
   * @param {Number} min 
   * @param {Number} max 
   */
  function randomNumber(min, max) {
    return (Math.random() * (max - min) | 0) + min
  }

  /**
   * 绘制星型
   * @param {roughCanvas} rc 
   * @param {Object} point 
   * @param {String} fill 
   */
  function drawStar(rc, point, fill) {
    let dots = []
    let {
      x,
      y,
      size,
      rotate
    } = point
    let r = size
    let R = size * 1.5
    for (var i = 0; i < 5; i++) {
      let pointStartX = Math.cos((18 + 72 * i - rotate) / 180 * Math.PI) * R + x
      let pointStartY = -Math.sin((18 + 72 * i - rotate) / 180 * Math.PI) * R + y
      let pointEndX = Math.cos((54 + 72 * i - rotate) / 180 * Math.PI) * r + x
      let pointEndY = -Math.sin((54 + 72 * i - rotate) / 180 * Math.PI) * r + y
      dots.push([pointStartX, pointStartY])
      dots.push([pointEndX, pointEndY])
    }
    rc.polygon(dots, {
      fill
    })
  }

  /**
   * 绘制三角
   * @param {roughCanvas} rc 
   * @param {Object} point 
   * @param {String} fill 
   */
  function drawTria(rc, point, fill) {
    let {
      x,
      y,
      size,
      rotate
    } = point
    let dy_l = y - size
    let dy_h = y + size / 2
    let dx_l = x - size * Math.cos((30 - rotate) / 180 * Math.PI)
    let dx_h = x + size * Math.cos((30 - rotate) / 180 * Math.PI)
    let dots = []
    dots.push([x, dy_l], [dx_h, dy_h], [dx_l, dy_h], [x, dy_l])
    rc.polygon(dots, {
      fill
    })
  }

  /**
   * 创建形状对象
   * @param {Number} x 
   * @param {Number} y 
   */
  function createPoint (x, y, options) {
    let point = {
      x: x, // 坐标x
      y: y, // 坐标y
      time: 0, // 参与循环次数
      rotate: 0, // 旋转角度
      rate: options.rate || randomNumber(1, 4), // 旋转速度
      shape: options.shape || shapeArray[randomNumber(0, 2)], // 形状
      size: options.size || randomNumber(10, 21),
      fill: options.fill || `#${randomNumber(0, 255).toString(16)}${randomNumber(0, 255).toString(16)}${randomNumber(0, 255).toString(16)}` // 色彩 Math.floor(Math.random() * 255).toString(16)
    }
    console.log(point)
    return point
  }

  /**
   * 渲染
   * @param {roughCanvas} rc 
   */
  function draw(roughBg) {
    let {points, rc, timeLimit} = roughBg
    let {canvas, ctx} = rc
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let len = points.length
    if (len > 0) {
      let arr = []
      let dy = timeLimit / 100
      for (let i = 0; i < len; i++) {
        let point = points[i]
        point.y -= dy
        point.time += 1
        point.rotate += point.rate
        if (point.time <= timeLimit) {
          arr.push(point)
          let alpha = Math.floor((1 - point.time / timeLimit) * 255).toString(16)
          let fill = `${point.fill}${alpha.length === 1 ? '0' + alpha : alpha}`
          if (point.shape === 'star') { // 星
            drawStar(rc, point, fill)
          } else if (point.shape === 'tria') {
            drawTria(rc, point, fill)
          }
        }
      }
      rc.points = arr
    }
  }

  /**
   * 渲染
   */
  function render() {
    for (let i = 0, len = roughArray.length; i < len; i++) {
      draw(roughArray[i])
    }
    window.requestAnimationFrame(render)
  }

  /**
   * 初始化
   * @param {*} bg 
   */
  function initRoughBg(bg) {
    // dom
    bg.rc = rough.canvas(document.querySelector(bg.options.el))
    roughArray.push(bg)
    // event
      let dom = document.querySelector(bg.options.el)
      dom.addEventListener('click', e => {
        let rect = dom.getBoundingClientRect()
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top
        bg.points.push(createPoint(x, y, bg.options))
      })
  }

  function RoughBg(options) {
    this.points = []
    this.options = options || {}
    this.timeLimit = 100
    initRoughBg(this)
    window.requestAnimationFrame(render)
  }

  window.RoughBg = RoughBg
})(window)