/**
 * Select
 *  version: 1.0
 *  api
 *    options
 *      el          : required, String. As a mount point, id is only supported at present
 *      multiple    : Boolean. for true, you can select multiple item, for false, only one
 *      size        : Number. [20, 100], if you enter one number out of this, Select will limit it as 20 or 100
 *      filterType  : String. for 'start', means your search will match the beginning of item, for 'in', if just match substring of item
 *      filterStyle : Object. define the style of your item that filtered. color & background is supported
 *      itemStyle   ：Object. define the style of your item. color & background is supported
 *    actions
 *      loadDatas(datas)              : load your data synchronous
 *      loadDatasAsync(url, callback) : load your data list asynchronous
 *      getValue()                    : get what you have selected, only an array of values
 *      appendDatas(datas)            : append &datas to your Select, so you can get more large datas
 *  use
 *    var select = new Select({
 *      el: '#select',
 *      size: 20
 *    })
 *    select.loadDatas(json)
 *    select.loadDatasAsync(url, function() {
 *      console.log('success')
 *    })
 *    var value = select.getValue()
 *    select.appendDatas(json)
 */
(function(window, undefined) {
  'use strict'

  //extension of array to check if item is in value
  Array.prototype.__contain = function(index) {
    for(var i = 0, len = this.length; i < len; i++) {
      if(this[i].index === index) {
        return true;
      }
    }
    return false;
  }

  //extension of array to remove a item
  Array.prototype.__remove = function(item, key) {
    var index = -1;
    for(var i = 0, len = this.length; i < len; i++) {
      if(this[i][key] === item[key]) {
        index = i;
        break;
      }
    }
    return this.splice(index, 1);
  }

  // MDN polyfill of filter ie9+
  if(!Array.prototype.filter) {
    Array.prototype.filter = function(fn, key) {
      if(!((typeof fn === 'Function' || typeof fn === 'function') && this)) {
        throw new TypeError();
      }
      var len = this.length >>> 0,
          res = new Array(len),
          t = this, c = 0, i = -1;
      if(key === undefined) {
        while(++i != len) {
          if(i in this) {
            if(fn(t[i], i, t)) {
              res[c++] = t[i];
            }
          }
        }
      }else {
        while(++i !== len) {
          if(i in this) {
            if(fn.call(key, t[i], i, t)) {
              res[c++] = t[i];
            }
          }
        }
      }
      res.length = c;
      return res;

    }
  }


  // custom tools
  // mixin custom & default
  function mixin(custom, defaultArg) {
    var mixinObj = {};
    for(var key in defaultArg){
      //if custom has no style, default will be active.. important: insure only API can be active
      if(defaultArg.hasOwnProperty(key)) {
        mixinObj[key] = !custom.hasOwnProperty(key) ? defaultArg[key] : custom[key]
      }
    }
    return custom;
  }

  // get cssText
  function cssText(obj) {
    var css = '';
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        css = css + key + ':' + obj[key] + ';'
      }
    }
    return css;
  }

  //template
  var template = 
    '<div class="select-wrapper">'
        + '<input type="text" class="select-textbox">'
        + '<div class="select-button">'
            + '<button type="button">'
                + '<span class="select-arrow"></span>'
            + '</button>'
            + ' <ul class="select-datalist select-hidden"></ul>'
        + '</div>'
    + '</div>';


  // select tools
  // setIfChecked
  function setIfChecked(select, domList) {
    var itemsArray = Array.prototype.slice.call(domList);
    itemsArray.forEach(function(item) {
      item.className = select._values.__contain(Number(item.getAttribute('data-index'))) ? 'select-selected' : '';
      return item;
    })
  }

  // show items of your table
  function showTable(select, condition) {
    //clear & reload
    loadDatas(select, dataFilter(select._datas, condition, select.options.filterType), condition)
    // ie9+
    select._doms.dataList.className = "select-datalist";
  }

  // hide table, select-wrapper or item-wrapper
  function hideTable(select) {
    select._page = 1
    select._doms.dataList.className = "select-datalist select-hidden"
  }

  // calculate textbox
  function calculateTextBox(select) {
    var txt = ''
    for(var i = 0, len = select._values.length; i < len; i++) {
      if(i === 0) {
        txt = select._values[i].description;
      }else {
        txt = txt + ', ' + select._values[i].description;
      }
    }
    return txt;
  }

  // set datas
  function setData(select, target) {
    var textBox = select._doms.textBox;
    var index = Number(target.getAttribute('data-index'));
    var item = select._datas[index];
    if(select.options.multiple) {
      // want to cancel
      if(target.className === 'select-selected' ) {
        var cancelItem = select._values.__remove(item, 'index');
        target.className = '';
      }else {
        // want to check
        select._values.push(item);
        target.className = 'select-selected';
      }
      // TODO if multiple functional, should change the way how to deal with multiple
      textBox.value = calculateTextBox(select)
      if(select._values.length > 1) {
        textBox.setAttribute('disabled', 'disabled');
        textBox.setAttribute('title', textBox.value);
      }else {
        textBox.removeAttribute('disabled');
      }
    }else {
      textBox.value = item.description;
      select._values = [item];
    }
    //set flag
    textBox.style.background = textBox.value ? '#bdefbd' : '';
  }

  // clear data store, also means reset
  function clearData(select) {
    select._datas = [];
    select._values = [];
    select._doms.textBox.value = '';
    select._doms.dataList.innerHTML = '';
  }

  //create inner html of li
  function createItemContext(data, li, condition, options) {
    if(condition) {
      // in
      if(options.filterType !== 'start') {
        var headSpan = document.createElement('span');
        var footSpan = document.createElement('span');
        var start = data.description.indexOf(condition);
        headSpan.innerText = data.description.substring(0, start);
        footSpan.innerText = data.description.substring(start + condition.length);
        var lightSpan = document.createElement('span');
        lightSpan.innerText = condition ? condition : data.description;
        lightSpan.style.cssText = cssText(options.filterStyle)
        li.appendChild(headSpan);
        li.appendChild(lightSpan);
        li.appendChild(footSpan);
      }else {
        // start
        var headSpan = document.createElement('span');
        var bodySpan = document.createElement('span');
        headSpan.style.cssText = cssText(options.filterStyle)
        headSpan.innerText = condition;
        bodySpan.innerText = data.description.substring(condition.length)
        li.appendChild(headSpan);
        li.appendChild(bodySpan);
      }
    }else {
      // not search
      var span = document.createElement('span');
      span.innerText = data.description;
      li.appendChild(span);
    }
    return li;
  }

  // create item by condition
  function createItem(data, condition, options) {
    var li = document.createElement('li');
    li.setAttribute('data-description', data.description);
    li.setAttribute('data-value', data.value);
    li.setAttribute('data-index', data.index);
    li.style.color = options.itemStyle.color;
    li.style.cssText = cssText(options.itemStyle)
    
    return createItemContext(data, li, condition, options)
  }

  //load datas from local
  function loadDatas(select, datas, condition) {
    var dataList = select._doms.dataList;
    // fragment
    var frag = document.createDocumentFragment();
    var currentCount = select._page * select.options.size;
    for(var i = 0, len = currentCount > datas.length ? datas.length : currentCount; i < len; i++) {
      frag.appendChild(createItem(datas[i], condition, select.options));
    }
    // clear
    dataList.innerHTML = '';
    // set if is checked
    setIfChecked(select, frag.childNodes)
    dataList.appendChild(frag);
  }

  // if src start with condition
  function stringBegin(src, condition) {
    return src.indexOf(condition) === 0
  }

  // if condition is in src
  function stringIn(src, condition) {
    return src.indexOf(condition) > -1
  }

  // filter
  function dataFilter(datas, condition, filterType) {
    return datas.filter(function(item, i, arr) {
      var fn = filterType === 'start' ? stringBegin : stringIn;
      return fn(item.description, condition);
    })
  }
  // indexify
  function dataIndex(data) {
    return data.map(function(item, index) {
      item.index = index
      return item
    })
  }

  // send ajax get
  function ajaxGet(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.timeout = 10000
    xhr.responseType = 'json'
    xhr.onload = function() {
      if(xhr.status === 200 || xhr.status === 304){
        callback && callback(xhr.response)
      }else {
        throw new Error('http request got result > status=' + xhr.status)  
      }
    }
    xhr.onerror = function(e) {
      throw new Error(e)
    }
    xhr.open("GET", url)
    xhr.send()
  }

  // load datas async
  function loadRemoteDatas(url, select, callback) {
    ajaxGet(url, function(response) {
      var datas = dataIndex(response);
      loadDatas(select, datas);
      select._datas = datas;
      callback && typeof callback === 'function' && callback();
    })
  }

  //global event
  document.addEventListener('click', function(e) {
    var target = e.target
    var domsArray = Array.prototype.slice.call(document.querySelectorAll('.select-datalist'));
    domsArray.forEach(function(dom, index) {
      if(dom.className === "select-datalist") {
        dom.className = "select-datalist select-hidden"
      }
    })
    e.stopPropagation();
  })

  // check if options is allowed and set default values if there are no values
  function validateAndInitOption(options) {
    if(!options.el) throw new Error('Cannot find a Block Node to mount your Select, because el is null')
    if(options.el.indexOf('#') !== 0) throw new Error('Only support to use id as your mount point at present')
    if(options.multiple && typeof options.multiple !== 'boolean') throw new Error('please set @multiple as Boolean')
    if(options.size && typeof options.size !== 'number') throw new Error('please set @size as Number')
    if(options.filterType && typeof options.filterType !== 'string') throw new Error('please set @filterType as String')
    if(options.filterStyle && Object.prototype.toString.call(options.filterStyle) !== '[object Object]') throw new Error('please set @filterStyle as Object')
    if(options.itemStyle && Object.prototype.toString.call(options.itemStyle) !== '[object Object]') throw new Error('please set @itemStyle as Object')

    options.multiple = options.multiple || false
    if(options.size) {
      if(options.size < 20) options.size = 20;
      if(options.size > 100) options.size = 100;
    }else {
      options.size = 30;
    }

    options.filterType = options.filterType || 'start';
    if(options.filterType.toLowerCase() !== 'start' && options.filterType.toLowerCase() !== 'in') {
      throw new Error('please set @filterType as &start or &in')
    }

    var defaultFilter = {
      background: '',
      color: 'red'
    }
    var defaultItem = {
      background: ''
    }
    options.filterStyle = options.filterStyle || defaultFilter;
    options.itemStyle = options.itemStyle || defaultItem;
    mixin(options.filterStyle, defaultFilter);
    mixin(options.itemStyle, defaultItem);

    return options;
  }

  /**
   * init your select by regist actions
   * @param {this} select 
   */
  function initSelect(select) {
    //choose
    select._wrapper.addEventListener('click', function(e) {
      var target = e.target
      if(target.tagName.toLowerCase() === 'li') {
        setData(select, target)
        if(!select.options.multiple){
          hideTable(select)
        }
      }else if(target.parentElement.tagName.toLowerCase() === 'li') {
        setData(select, target.parentElement)
        if(!select.options.multiple){
          hideTable(select)
        }
      }else {
        showTable(select, select._values.length <= 1 ? select._doms.textBox.value : '')
      }
      e.stopPropagation()
    })

    var textBox = select._doms.textBox
    var dataList = select._doms.dataList

    // search
    textBox.addEventListener('input', function(e) {
      dataList.className = "select-datalist";
      var datas = dataFilter(select._datas, textBox.value, select.options.filterType);
      select._page = 1;
      loadDatas(select, datas, textBox.value);
      if(select._values.length === 1 && textBox.description !== select._values[0].description) {
        textBox.style.background = '#f5a4b2';
        select._values = [];
      }
      if(!textBox.value) {
        textBox.style.background = '';
      }
      e.stopPropagation();
    })

    // page
    dataList.addEventListener('scroll', function(e) {
      var target = e.target
      var lientY = target.scrollHeight - target.scrollTop

      // down
      var condition = !select.options.multiple ? textBox.value : ''; //TODO 修改此处适配多选的条件
      if(target.scrollTop - select._position > 0) {
        // bottom
        if(lientY < 200) {
          var datas = dataFilter(select._datas, condition, select.options.filterType);
          // if load more
          if(datas.length > select._page * select.options.size) {
            select._page += 1;
            loadDatas(select, datas, condition);
          }
        }
      }else { //up
        // top
        if(target.scrollTop < target.scrollHeight / 3 && select._page > 1) {
          var datas = dataFilter(select._datas, condition, select.options.filterType);
          select._page -= 1;
          loadDatas(select, datas, condition);
        }
      }
      select._position = target.scrollTop;
      e.stopPropagation();
    })
  }

  // Select@1.0
  function Select(options) {
    // options
    this.options = validateAndInitOption(options);
    // inner properties
    this._wrapper = document.querySelector(this.options.el)
    this._wrapper.innerHTML = template
    // inner dom Node
    this._doms = {
      dataList: this._wrapper.querySelector('.select-datalist'),
      textBox: this._wrapper.querySelector('.select-textbox')
    }
    // isArray for multiple, if single, you should getValue = this._values[0]
    this._values = [];
    // model
    this._datas = [];
    // current page
    this._page = 1;
    // scrollbar position
    this._position = 0;
    //init actions
    initSelect(this);
  }
  Select.prototype = {
    // load datas synchronous
    loadDatas: function(datas) {
      clearData(this);
      this._datas = dataIndex(datas);
      loadDatas(this, datas);
    },
    // load datas asynchronous
    loadDatasAsync: function(url, callback) {
      clearData(this);
      loadRemoteDatas(url, this, callback);
    },
    // get value
    getValue: function() {
      return this._values;
    },
    // allow you load datas asynchronous by use this method in your asynchronous actions
    appendDatas: function(datas, callback) {
      this._datas = this._datas.concat(JSON.parse(JSON.stringify(datas)));
      this.loadDatas(this._datas);
	  callback && callback()
    }
  };
  window.Select = window.Select || Select;
})(window);