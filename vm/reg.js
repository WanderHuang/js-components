var reg1 = new RegExp(/\{\{(.*)\}\}/);
console.log(reg1.test('{{123}}'))
var reg2 = new RegExp(/^\@.+/);
console.log(reg2.test('@click'))

var type =  '@click="randomMsg(hey)"'
// onclick = "randomMsg()"
console.log(type.replace(/\"+/, '').replace(/\"+/, ''))