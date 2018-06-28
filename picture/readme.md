# Picture

## 需求

　　逛博客时发现了[这种效果](http://ghmagical.com/)(左侧鼠标悬停，切换图片背景)，于是想自己写一套类似效果的轮播图。

* 图片轮播
* 翻页效果

  ## 简介

  该博主的背景图片区是固定大小的，猜测其代码可能是写死了。另外他有响应式布局，页面宽度不够时，这个背景都会被去掉。  
  　　我这里就没有考虑去做特殊处理了，既然是要做个组件，那就是给定输入条件，得到具有一致性的结果。  
  　　**我的实现思路：**  
  * 底层用`background-image`实现切图
  * 根据图片大小和用户设置的切图比例，实现切图
  * 设置对应的动画数组，加载动画时，用该数组去对应不同的动画

    ## 实现功能
* 鼠标悬停切换图片
* 图片切换时小图依次翻页(动效)

  ## 使用

  【TODO】

## 效果演示

![demo_1](https://github.com/WanderHuang/js-components/tree/master/docs/picture_demo_1.gif)

![demo_2](https://github.com/WanderHuang/js-components/tree/master/docs/picture_demo_2.gif)

## TODO LIST

* 更友好的API
* 支持多种动效
* 支持手动调用图片切换
* 能结合上一页、下一页更好
