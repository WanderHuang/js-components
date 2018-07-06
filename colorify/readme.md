# colorify

- 支持链式调用

- 便于拿来封装为日志引擎

- 支持多种色彩

- 浏览器中支持自定义颜色或样式

- 支持在Vue项目和Node项目中使用

```javascript
// cyan | green | yellow | red等内置颜色 支持链式调用
// underline | bold 支持下划线强调
// wirte() 向当前line写入字符，采用此write前的样式
// show()展示当前所有已经write到行中的字符串 支持链式调用
Colorify.green().underline().write('Green').show()
Colorify.cyan().underline().wrap('@').write('Cyan').wrap('-').yellow().write('Yellow').show()
Colorify
  .red().underline().wrap('-').write('RED WORDS')
  .cyan().wrap('*').write('cyan').write('cyan')
  .yellow().write('yellow')
  .show()
  .blue().write('LOG blue--->')
  .show()
```



# 参考文章

- [AlloyTeam从console说起](http://www.alloyteam.com/2013/11/console-log/)

- [stackoverflow:ansi-color-escape-sequences](https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences)

- [tip_colors_and_formatting](https://misc.flogisoft.com/bash/tip_colors_and_formatting)

# 演示效果

![image](https://github.com/WanderHuang/js-components/blob/master/docs/colorify_demo.gif)

# TODO

- 优化代码结构

- 支持对外友好封装

- 扩展更多色彩和样式(ansi)
