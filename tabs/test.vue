<template>
  <div>
    <div class="wrap-1">
      <simple-tabs :show.sync="showStatus" :activeName.sync="activeName" layout="bottom">
        <simple-tabs-pane name="label_1" label="Label_1">
          <div class="content c1">1</div>
        </simple-tabs-pane>
        <simple-tabs-pane name="label_2" label="Label_2">
          <div class="content c2">2</div>
        </simple-tabs-pane>
        <simple-tabs-pane name="label_3" label="Label_3">
          <div class="content c3">3</div>
        </simple-tabs-pane>
      </simple-tabs>
      <div class="blank">
        <p>center</p>
      </div>
      <simple-tabs :show.sync="showStatus2" :activeName.sync="activeName2">
        <simple-tabs-pane name="label_4" label="Label_4">
          <div class="content c4">1</div>
        </simple-tabs-pane>
        <simple-tabs-pane name="label_5" label="Label_5">
          <div class="content c5">2</div>
        </simple-tabs-pane>
        <simple-tabs-pane name="label_6" label="Label_6">
          <div class="content c6">3</div>
        </simple-tabs-pane>
      </simple-tabs>
    </div>
    <div class="wrap-2">
      <simple-tabs :show.sync="showStatus" :activeName.sync="activeName" layout="left" tabPosition="top">
        <simple-tabs-pane name="label_1" label="Label_1">
          <div class="content c1">1</div>
        </simple-tabs-pane>
        <simple-tabs-pane name="label_2" label="Label_2">
          <div class="content c2">2</div>
        </simple-tabs-pane>
        <simple-tabs-pane name="label_3" label="Label_3">
          <div class="content c3">3</div>
        </simple-tabs-pane>
      </simple-tabs>
      <div class="blank">
        <p>center</p>
      </div>
      <simple-tabs :show.sync="showStatus2" :activeName.sync="activeName2" layout="right" tabPosition="top">
        <simple-tabs-pane name="label_4" label="Label_4">
          <div class="content c4">1</div>
        </simple-tabs-pane>
        <simple-tabs-pane name="label_5" label="Label_5">
          <div class="content c5">2</div>
        </simple-tabs-pane>
        <simple-tabs-pane name="label_6" label="Label_6">
          <div class="content c6">3</div>
        </simple-tabs-pane>
      </simple-tabs>
    </div>
  </div>
</template>
<script>
import SimpleTabs from './SimpleTabs'
import SimpleTabsPane from './SimpleTabsPane'
export default {
  name: 'tabs-test',
  components: {SimpleTabs, SimpleTabsPane},
  data () {
    return {
      showStatus: false,
      activeName: 'label_1',
      showStatus2: false,
      activeName2: 'label_4'
    }
  }
}
</script>
<style lang="less" scoped>
.wrap-1 {
  display: flex;
  flex-direction: column;
}
.wrap-2 {
  display: flex;
  flex-direction: row;
}
.wrap-1, .wrap-2 {
  height: 400px;
  width: 600px;
  
  background: #404040;
  > .blank {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #fff;
  }
  .content {
    background: #282828;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    &.c1 {
      height: 100px;
    }
    &.c2 {
      height: 200px;
    }
    &.c3 {
      height: 300px;
    }
    &.c4 {
      height: 300px;
    }
    &.c5 {
      height: 200px;
    }
    &.c6 {
      height: 100px;
    }
  }
}
.fade-enter, .fade-leave {
  transition: all ease 0.3s;
}
.fade-enter-active, .fade-leave-active {
  opacity: 0;
}
</style>
