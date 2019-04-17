<script>
export default {
  name: 'simple-tabs-pane',
  props: {
    label: {
      type: String | Number,
      required: true
    },
    name: {
      type: String | Number,
      required: true
    }
  },
  methods: {
    onTabClicked () {
      // 可以随意对外提供功能
      this.$emit('tabchange', this.name)
    }
  },
  render () {
    // 获取this的属性和方法
    const {name, label, onTabClicked} = this
    let $parent = this.$parent
    if ($parent.$vnode) {
      let tag = $parent.$vnode.componentOptions.tag
      // 获取父组件的tag，保证配套使用
      while (tag !== 'simple-tabs') {
        $parent = $parent.$parent
        tag = $parent.$vnode.componentOptions.tag
      }
    }
    return (
      <div
        class={`tab-pane`}
        v-show={$parent.activeName === name && $parent.show}
        on-click={(ev) => onTabClicked(name, label, ev)}
      >
        {
          // 插槽组件渲染
          this.$slots.default
        }
      </div>
    )
  }
}
</script>
<style lang="less" scoped>
.tab-pane {
  width: 100%;
  height: 100%;
}
</style>
