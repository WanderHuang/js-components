// default styles of Colorify
const DEFAULT_STYLE = {
  // 字体样式
  'bold': ['\x1B[1m', '\x1B[22m'],
  'italic': ['\x1B[3m', '\x1B[23m'],
  'underline': ['\x1B[4m', '\x1B[24m'],
  'inverse': ['\x1B[7m', '\x1B[27m'],
  'strikethrough': ['\x1B[9m', '\x1B[29m'],
  // 前景色
  'white': ['\x1B[37m', '\x1B[39m'],
  'grey': ['\x1B[90m', '\x1B[39m'],
  'black': ['\x1B[30m', '\x1B[39m'],
  'blue': ['\x1B[34m', '\x1B[39m'],
  'cyan': ['\x1B[36m', '\x1B[39m'],
  'green': ['\x1B[32m', '\x1B[39m'],
  'magenta': ['\x1B[35m', '\x1B[39m'],
  'red': ['\x1B[31m', '\x1B[39m'],
  'yellow': ['\x1B[33m', '\x1B[39m'],
  // 背景色
  'whiteBG': ['\x1B[47m', '\x1B[49m'],
  'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
  'blackBG': ['\x1B[40m', '\x1B[49m'],
  'blueBG': ['\x1B[44m', '\x1B[49m'],
  'cyanBG': ['\x1B[46m', '\x1B[49m'],
  'greenBG': ['\x1B[42m', '\x1B[49m'],
  'magentaBG': ['\x1B[45m', '\x1B[49m'],
  'redBG': ['\x1B[41m', '\x1B[49m'],
  'yellowBG': ['\x1B[43m', '\x1B[49m']
}
const Colorify = {
  _stack        : [],                               // 调用栈
  _styles       : [],                               // 每次增加的style
  _line         : '',                               // 一行数据
  _color        : '',
  _custom       : '',
  _inBrowser     : typeof window !== 'undefined'     // 是浏览器还是node环境
}

/**
 * every method push itself to STACK, which stored for show later
 */
Object.keys(DEFAULT_STYLE).map(function (item) {
  if (DEFAULT_STYLE.hasOwnProperty(item)) {
    Colorify[item] = function () {
      Colorify._stack.push(item)
      Colorify._color = item
      return Colorify
    }
  }
})

/**
 * add your notes to store
 * @param {*} colorify
 * @param {*} msg
 */
function browserNoteAdd (colorify, msg) {
  colorify._line += '%c' + msg
  if (colorify._custom) {
    styles.push(colorify._custom)
    colorify._custom = null
  } else {
    styles.push('color: ' + colorify._color)
    colorify._color = null
  }
}

/**
 * add your notes to store
 * @param {*} msg 
 */
function nodeNoteAdd (colorify, msg) {
  while (colorify._stack.length > 0) {
    let item = colorify._stack.pop()
    msg = DEFAULT_STYLE[item][0] + msg + DEFAULT_STYLE[item][1]
  }
  colorify._line += msg // add one note
}

/**
 * support wrap a word
 * @param {*} wrap
 */
Colorify.wrap = function (wrap) {
  this._wrap = wrap
  return Colorify
}

/**
 * custom style
 * @param {*} style
 */
Colorify.custom = function (style) {
  this._custom = style
  return Colorify
}

/**
 * write a message in stream
 */
Colorify.write = function (msg) {
  msg = this._wrap ? this._wrap + msg + this._wrap : msg
  this._wrap = ''
  this._inBrowser ? browserNoteAdd(this, msg) : nodeNoteAdd(this, msg)
  return this
}

/**
 * show your words as a line
 */
Colorify.show = function () {
  this._inBrowser ? console.log(this._line, ...this._styles) : console.log(this._line)
  this._line = ''
  this._styles = []
  return this
}
// in Vue project ColorifyConsole
// cc.red().write('LOG').write(' : ').cyan().write('hello colorify').show().red().write('LOG').write(' : ').cyan().write('hello colorify').show()
// export const cc = Colorify
// in node project
exports.Colorify = Colorify
