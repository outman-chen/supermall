<template>
  <div id='home'>
    <nav-bar class="home-nav"><template v-slot:center>购物街</template></nav-bar>

    <scroll class="content"
            ref='scroll'
            :probeType='3' 
            @pscroll='contentScroll'
            :pull-up-load="true"
            @pullingUp='loadMore'>
      <template v-slot>
        <home-swiper :banners="banner" />
        <recommend-view :recommends="recommend" />
        <feature-view />
        <tab-control class="tab-control"
                     :titles="['流行','新款','精选']"
                     @tabClick='tabClick' />
        <goods-list :goods='showGoods' />
        <div><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /></div>
      </template>
    </scroll>
    <back-top @click.native='backClick' v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import { getHomeMultidata, getHomeGoods } from 'network/home'

export default {
  name: 'Home',
  components: {
    NavBar,
    getHomeMultidata,
    getHomeGoods,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data () {
    return {
      banner: [],
      recommend: [],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
      },
      currentType: 'pop',
      isShowBackTop:false
    }
  },
  computed: {
    showGoods () {
      return this.goods[this.currentType].list
    }
  },
  created () {
    //1.请求多个数据
    this.getHomeMultidata()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  methods: {
    /**
    事件监听
     */
    tabClick (index) {
      switch (index) {
        case 0:
          currentType = 'pop'
          break
        case 1:
          currentType = 'new'
          break
        case 2:
          currentType = 'sell'
          break
      }
    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0)
    },
    contentScroll(position){
      // console.log(position)
      this.isShowBackTop=(-position.y)>200
    },
    loadMore(){
      this.getHomeGoods(this.currentType)

      this.$refs.scroll.scroll.refresh()
    },
    /*
    网络请求方法
     */
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        // console.log(res)
        this.banner = res.data.banner.list
        this.recommend = res.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        this.$refs.scroll.finishPullUp()
      })
    }
  }
}

</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  position: relative;
  height: 100vh;
}
.home-nav {
  background-color: pink;
  color: #fff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
.tab-control {
  position: sticky;
  top: 44px;
}
.content {
  /* height: 300px; */
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;

  overflow: hidden;
}
</style>