# select 组件 #
## 简介 ##
参考了[bootstrap-select](https://silviomoreto.github.io/bootstrap-select/)、[lzw.me/bootstrap-suggest-plugin](http://lzw.me/pages/demo/bootstrap-suggest-plugin/demo/).目前处于初级阶段，仅完成部分内容。  
### 实现功能 ###

* **下拉列表选择**: select基本功能
* **下拉列表搜索**: 带输入框，模糊匹配字符串。两种模式：start@从头匹配、in@全字符串模糊匹配
* **多选**: 支持多选，但多选时，搜索功能暂不提供，待优化。
* **多选取消**： 支持多个选项的取消
* **内容提示**： 选择对的数据，底色为`#bdefbd`, 数据有误时底色为`#f5a4b2`
* **异步加载**： 支持通过url访问后端数据，返回数据受到约束
* **异步添加数据**： append方法支持对`Select`对象的异步加载，提供回调函数
* **数据获取**： `Select.getValue`支持获取初始加载并被选中的，方便对数据的后续操作
* **延迟渲染**： 大数据量时，数据先处理，但内部存在分页机制， 滚动时才渲染分页数据。可以优先加载数据(自测100w)，用户不用关心渲染时间。
* **大数据搜索**： 支持对未渲染元素的搜索，几乎零延时。搜索结果自动分页
* **滚动分页**： 支持首页20-100条数据，往下滚动加页，往上滚动减页  
### 使用 ###

* 引入样式 `<link rel="stylesheet" href="./select.css">`
* 引入js  `<script src="./select.js"></script>`
* 挂载select完成初始化  

		var select = new Select({
		    el: '#select',
		    size: 40,
		    filterStyle: {
		      color: 'red'
		    },
		    multiple: false
		  })

* 加载数据`select.loadDatas(json)`or`select.loadDatasAsync(url)`

## 效果演示 ##

![image](https://github.com/WanderHuang/js-components/blob/master/docs/select_demo.gif)

## TODO LIST ##
* 支持数据分类及分类搜索
* 支持多选搜索