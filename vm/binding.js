/**
 * 实现类似vue的数据绑定效果
 */
!(function() {

    /**
     * 给this._data.prop设置代理为this.prop
     * @param {Object} datas 
     */
    function _proxy (datas) {
        const that = this;
        Object.keys(datas).forEach(key => {
            Object.defineProperty(that, key, {
                configurable: true,
                enumerable: true,
                get: function proxyGetter () {
                    return that._data[key]; // 调用this._data.prop
                },
                set: function proxySetter (val) {
                    that._data[key] = val;
                }
            })
        });
    }

    /**
     * 定义响应式节点数据
     * @param {Object} binding 
     * @param {String} prop 
     */
    function defineDataReactive(binding, prop) {
        // 拿取绑定过数据的节点
        binding._doms[prop].els = binding.el.querySelectorAll('[' + binding._dataTag + '="' + prop + '"]');
        [].forEach.call(binding._doms[prop].els, function (e) {
            e.removeAttribute(binding._tag)
        })

        // 数据变化时，调用
        Object.defineProperty(binding._data, prop, {
            set: function (newVal) {
                [].forEach.call(binding._doms[prop].els, function (e) {
                    // 设置节点数据
                    binding._doms[prop].value = e.textContent = newVal
                })
            },
            get: function () {
                return binding._doms[prop].value
            }
        })
    }

    /**
     * 初始化dom节点
     * @param {Object} binding 
     */
    function initDom(binding) {
        // 替换{{}}内容为临时数据标签
        // 替换@click内容为临时事件标签
        var content = binding.el.innerHTML
                        .replace(/\{\{(.*)\}\}/g, function (match, prop) {
                            binding._doms[prop] = {} // 注册节点
                            return '<span ' + binding._dataTag + '="' + prop +'"></span>'
                        }).replace(/\@.*\=.*\"/g, function (match, prop) {
                            var type = match.split('=')[0].replace(/\@/,'')
                            var method = match.split('=')[1].replace(/\"/, '').replace(/\"/, '')
                            return binding._methodTag.method + '="' + method + '"' + ' '+ binding._methodTag.type + '="' + type + '"'
                        })
        binding.el.innerHTML = content
    }

    /**
     * 初始化数据的响应式效果
     * @param {Object} binding 
     * @param {Object} datas 
     */
    function initData(binding, datas) {
        // 注册成响应式的数据
        for (var prop in datas) {
            defineDataReactive(binding, prop)
        }

        // 初始化数据 会调用一次set方法
        for (var prop in datas) {
            binding._data[prop] = datas[prop]
        }
    }

    /**
     * 初始化事件绑定
     * @param {Object} binding 
     * @param {Object} methods 
     */
    function initEvent(binding, methods) {
        var els = binding.el.querySelectorAll('[' + binding._methodTag.method + ']');
        // 为每个节点注册相应的事件
        [].forEach.call(els, function (el) {
            var tempMethod = el.getAttribute(binding._methodTag.method)
            el.addEventListener(el.getAttribute(binding._methodTag.type), function(e) {
                methods[tempMethod].call(binding, e)
            })
            el.removeAttribute(binding._methodTag.type)
            el.removeAttribute(binding._methodTag.method)
        })
    }
    
    /**
     * 数据绑定
     * @param {Object} options 
     */
    function Binding(options) {
        // 根节点初始化
        this.el = document.querySelector(options.el)
        // 内部数据
        this._data = {}
        // 内部节点
        this._doms = {}
        // 内部临时数据标签
        this._dataTag = 'data-binding'
        // 内部临时事件标签
        this._methodTag = {}
        this._methodTag.type = 'event-type'
        this._methodTag.method = 'event-method'
        // 设置代理，this 代理 this.datas
        _proxy.call(this, options.datas);
        // 挂载dom
        initDom(this)
        // 初始化数据
        initData(this, options.datas)
        // 初始化事件
        initEvent(this, options.methods)

        // options.mounted && options.mounted.call(this)
    }

    window.Binding = Binding
}())