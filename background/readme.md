# Canvas背景特效 #
## 需求 ##
* 实现一个背景组件
* 点击有特效
* hover有特效
* 定制色彩
* 定制图案
## 简介 ##
给网站加点料
### 实现功能 ###

* **点击特效**：点击时出现一点小特效
* **定制速率**：定制运动速率
* **定制色彩**：组件使用了[roughjs](https://github.com/pshihn/rough)
### 使用 ###

* 引入`rough`  `<script src="./rough.min.js"></script>`

* 引入`background` `<script src="./rough.bg.js"></script>`

* 挂载el完成初始化  

   ```javascript
   new RoughBg({
         el: '#canv1',
         rate: 2, // 可选
         shape: 'star', // 可选 'star' 'tria'
         size: 20, // 可选
         fill: '#777777' // 可选
       })
   ```

## 效果演示 ##

![image](https://github.com/WanderHuang/js-components/blob/master/docs/background_demo.gif)

## TODO LIST ##
* 支持更多运动方式
* 支持更多图案
* 支持更高的定制化
