<script>
export default {
  name: 'simple-tabs',
  props: {
    // horizon(top bottom) vertical(left right)
    layout: {
      type: String,
      default: () => 'top'
    },
    // tab方向。水平有左右之分，竖直有上下之分。
    tabPosition: {
      type: String,
      default: () => 'left'
    },
    show: {
      type: Boolean,
      default: () => false
    },
    activeName: {
      type: String,
      default: () => ''
    },
    beforeTabChange: {
      type: Function
    }
  },
  data () {
    return {
      panes: []
    }
  },
  methods: {
    calcPaneInstances (isLabelUpdated = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(vnode => vnode.tag &&
          vnode.componentOptions && vnode.componentOptions.tag === 'simple-tabs-pane')
        const panes = paneSlots.map(({ componentInstance }) => componentInstance)
        const panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]))
        if (isLabelUpdated || panesChanged) {
          this.panes = panes
          if (this.panes.length > 0) {
            this.activeName = this.panes[0].name
          }
        }
      } else if (this.panes.length !== 0) {
        this.panes = []
      }
    },
    onShowChange () {
      // 对外提供扩展
      this.$emit('update:show', !this.show)
      this.$emit('showChange', this.show)
    },
    onTabChange (name) {
      // 对外提供扩展
      this.$emit('update:beforeTabChange')
      if (this.beforeTabChange) {
        Promise.resolve(this.beforeTabChange(name, this.activeName)).then((success) => {
          this.updateActiveName(name)
        })
      } else {
        this.updateActiveName(name)
      }
    },
    updateActiveName (name) {
      // 对外提供扩展
      this.$emit('update:activeName', name)
      this.$emit('tabChange', this.activeName)
    }
  },
  mounted () {
    // 统计内部子组件参数，方便渲染
    this.calcPaneInstances()
  },
  render (h) {
    // 获取this的属性和方法
    const {layout, tabPosition, panes, show, activeName, onShowChange, onTabChange} = this
    return (
      <div class={`simple-tabs ${layout} ${layout === 'top' || layout === 'bottom' ? 'horizon' : 'vertical'}`}>
        <div class={`simple-tabs__header`}>
          <div class={`tab-box tab-${tabPosition}`}>
            {
              // 渲染多个label
              panes.map((pane, index) => {
                return (
                  <div
                    class={{
                      tab: true,
                      'tab-activated': pane.name === activeName
                    }}
                    key={index}
                    on-click={(ev) => onTabChange(pane.name, ev)}
                  >
                    {pane.label}
                  </div>
                )
              })
            }
          </div>
          <div class={`tool-box ${layout}`}>
            <div on-click={onShowChange} style={{cursor: 'pointer'}}>{show ? 'close' : 'show'}</div>
          </div>
        </div>
        <div class={`simple-tabs__body`}>
          {
            // 渲染插槽组件，即实际的子组件渲染在这里
            this.$slots.default
          }
        </div>
      </div>
    )
  }
}
</script>
<style lang="less" scoped>
@backgroundBlack: #000;
@colorWhite: #fff;
@borderGray: #404040;
@hoverColor: #408ee6;
.simple-tabs {
  display: flex;
  background: @borderGray;
  z-index: 666;
  > .simple-tabs__header {
    background: @backgroundBlack;
    display: flex;
    align-content: center;
    height: 24px;
    line-height: 24px;
    border-top: 1px solid @borderGray;
    border-bottom: 1px solid @borderGray;
    > .tab-box {
      flex: 1;
      display: flex;
      > .tab {
        border-left: 1px solid @borderGray;
        color: @colorWhite;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
          color: @hoverColor;
        }
      }
    }
    > .tool-box {
      display: flex;
      align-items: center;
      color: @colorWhite;
      i {
        cursor: pointer;
        line-height: 24px;
        font-size: 14px;
        padding: 0 5px;
      }
      i:hover {
        color: @hoverColor
      }
    }
  }
  > .simple-tabs__body {
    background: #282828;
    flex: 1;
  }
}
.horizon {
  height: 24px;
  width: 100%;
}
.vertical {
  // width: 24px;
  height: 100%;
  .simple-tabs__header {
    flex-direction: column;
    height: 100%;
    width: 80px;
    border: none;
    align-items: center;
  }
}
.top {
  flex-direction: column-reverse;
}
.bottom {
  flex-direction: column;
}
.left {
  flex-direction: row;
}
.right {
  flex-direction: row-reverse;
}
.tab-left {
  flex-direction: row;
  justify-content: start;
}
.tab-right {
  flex-direction: row;
  justify-content: end;
}
.tab-top {
  flex-direction: column;
  justify-content: start;
}
.tab-bottom {
  flex-direction: column;
  justify-content: end;
}
.tab-activated {
  background: #404040;
}
</style>
