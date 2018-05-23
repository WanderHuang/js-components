/**
 * api
 *  el
 *  row
 *  col
 *  width
 *  height
 *  delay
 *  images
 */
;(function(window, undefined) {


  function replaceBackground(picture) {
    const nodes = picture._table.childNodes
    picture._index = getIndex(picture)
    for(let i = 0; i < nodes.length; i++) {
        nodes[i].className = nodes[i].className === 'ani2' ? 'ani1' : 'ani2'
        ;(function(i) {
          setTimeout(function() {
            nodes[i].style.backgroundImage = 'url('+ picture.options.images[picture._index] + ') '
          }, 100 * i)
        }(i))
    }
  }

  function initDomTree(picture) {

    picture._wrapper = document.querySelector(picture.options.el)
    picture._wrapper.classList.add('pics-wrapper')
    picture._wrapper.style.width = picture.options.width + 'px'
    picture._wrapper.style.height = picture.options.height + 'px'


    let back = document.createElement('div')
    back.classList.add('pics-background')
    let table = document.createElement('ul')
    table.classList.add('pics-list')

    table.appendChild(createTable(picture))


    picture._back = back
    picture._table = table
    picture._wrapper.appendChild(back)
    picture._wrapper.appendChild(table)
  }

  function getCssText(picture, i, col, block_width, block_height) {
    
    let i_row = Math.floor(i / col)
    let i_col = i % col
    let cssText = 'background-image:url('+ picture.options.images[picture._index] +');'
      cssText += 'background-position:' + '-'+ (i_col * block_width)+'px'+' -'+ (i_row * block_height) + 'px' + ';'
      cssText += 'animation-delay:' + (picture.options.delay * i)+'s;'
      cssText += 'width: ' + block_width + 'px;'
      cssText += 'height: ' + block_height + 'px;'
    return cssText
  }

  function createTable(picture) {
    const row = picture.options.row
    const col = picture.options.col
    const len = row * col
    const block_width = Math.floor(picture.options.width / col)
    const block_height = Math.floor(picture.options.height / row)
    const frag = document.createDocumentFragment();
    picture._index = getIndex(picture)
    for(let i = 0; i < len; i++) {
      let li = document.createElement('li')
      li.style.cssText = getCssText(picture, i, col, block_width, block_height)
      frag.appendChild(li)
    }
    return frag
  }

  function getIndex(picture) {
    let index = -1
    while(index === -1 || index === picture._index) {
      index = ((Math.random() * picture.options.images.length) | 0)
    }
    return index
  }

  const Picture = function (options) {
    this.options = options || {}
    this._index = -1
    initDomTree(this)
  }
  Picture.prototype.run = function() {
    const picture = this
    this._wrapper.addEventListener('mouseenter', function(e) {
      picture._back.style.backgroundImage = 'url('+ picture.options.images[picture._index === -1 ? 1 : picture._index] + ')'
      replaceBackground(picture)
    })
  }

  window.Picture = Picture
  
}(window))