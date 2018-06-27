(function() {

  // default simple-grid style
  var DEFAULT_STYLE = {
    align: 'left',
    backgroundColor: '#fff',
    color: '#000'
  }

  // col prop
  var COL_KEYS = []

  var SimpleGrid = function (options) {
    console.log('Engine > options: ' + JSON.stringify(options))
    DEFAULT_STYLE.align = options.align || DEFAULT_STYLE.align
    DEFAULT_STYLE.backgroundColor = options.backgroundColor || DEFAULT_STYLE.backgroundColor
    DEFAULT_STYLE.color = options.color || DEFAULT_STYLE.color
    COL_KEYS = options.cols.map(function (col) {
      return col.prop
    })
    this.options = options
    this._store = {}
    _initGrid(this)
  }


  /**
   * 渲染列表
   * @param {NodeList} arr 
   * @param {ObjectArray} datas
   */
  function _renderEngine (arr, datas) {
    for (var i = 0, row = arr.length; i < row; i++) {
      for (var j = 0, col = arr[i].length; j < col; j++) {
        arr[i][j].innerText = datas[i][COL_KEYS[j]]
      }
    }
  }

  /**
   * 渲染头部
   * @param {NodeList} headArray 
   * @param {ObjectArray} cols 
   */
  function _renderHead (headArray, cols) {
    var names = cols.map(function (col) {
      var res = {}
      res[col.prop] = col.name
      return res
    })

    // render
    for (var i = 0, len = headArray.length; i < len; i++) {
      headArray[i].innerText = names[i][COL_KEYS[i]]
    }
  }

  /**
   * 设置单元格样式
   * @param {NodeList} arr 
   * @param {ObjectArray} colsArray 
   */
  function _setCellStyle (arr, colsArray) {
    var i = 0, len = arr.length, rateDefault = 100 / len
    for (; i < len; i++) {
      var col = colsArray[i]
      var width = col.width ? col.width + '%' : rateDefault + '%' 
      var align = col.align ? col.align : DEFAULT_STYLE.align
      var backgroundColor = col.backgroundColor ? col.backgroundColor : DEFAULT_STYLE.backgroundColor
      var color = col.color ? col.color : DEFAULT_STYLE.color
      arr[i].style.cssText = 'width: ' + width + '; text-align: ' + align + ';'
      arr[i].style.cssText += 'background-color: ' + backgroundColor + ';' + 'color: ' + color + ';'
    }
  }

  /**
   * head 和 body的列单元格初始化
   * @param {Object} _store 
   * @param {ObjectArray} colsArray 
   */
  function initColStyle (_store, colsArray) {
    console.log('Engine > starting to set width')
    // head style
    _setCellStyle(_store.heads, colsArray)
    // body cell style
    for (var i = 0, len = _store.bodies.length; i < len; i++) {
      _setCellStyle(_store.bodies[i], colsArray)
    }
  }

  /**
   * 初始化节点容器
   * @param {Object} _store 
   * @param {String selector} el 
   */
  function initDomStore (_store, el) {
    var wrapper = document.querySelector(el)
    _store.wrapper = wrapper
    if (wrapper) {
      _store.heads = wrapper.querySelectorAll('th')
      _store.bodyRows = wrapper.querySelectorAll('.sg-body-row')
      _store.bodies = []
      for(var i = 0, len = _store.bodyRows.length; i < len; i++) {
        // store rows by row
        _store.bodies.push(_store.bodyRows[i].querySelectorAll('td'))
      }
    } else {
      throw new Error('Engine do not find el [' + el + '] in browser')
    }
  }

  /**
   * 初始化当前grid
   * @param {Object} instance 
   */
  function _initGrid(instance) {
    initDomStore(instance._store, instance.options.el)
    initColStyle(instance._store, instance.options.cols)
    _renderHead(instance._store.heads, instance.options.cols)
  }

  /**
   * 加载数据列表
   * @param {ObjectArray} datas 
   */
  SimpleGrid.prototype.loadDatas = function (datas) {
    _renderEngine(this._store.bodies, datas)
  }



  window.SimpleGrid = SimpleGrid
}())