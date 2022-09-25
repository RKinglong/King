<template>
  <div>
    <nav-bar>
      <template v-slot:left></template>
      <template v-slot:default>商品分类</template>
    </nav-bar>
    <div class="mainbox">
      <div class="ordertab">
        <van-tabs v-model:active="activekey" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>
      <van-sidebar class="leftmenu" v-model="active">
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item
            v-for="(item, index) in categories.slice(0, 5)"
            :key="item"
            :title="item.name"
            :name="index"
          >
            <van-sidebar-item
              v-for="sub in item.children"
              :key="sub.id"
              :title="sub.name"
              @click="getGoods(sub.id)"
            />
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>
      <div class="goodslist">
        <div class="content">
          <van-card
            v-for="item in showGoods"
            :key="item.id"
            @click="itemClick(item.id)"
            :num="item.comments_count"
            :tag="item.comments_count >= 0 ? '流行' : '新书'"
            :price="item.price"
            :desc="item.updated_at"
            :title="item.title"
            :thumb="item.cover_url"
            :lazy-load="true"
          />
        </div>
      </div>
    </div>
    <back-top @bTop="bTop" v-show="isShow"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import BackTop from "components/common/backtop/BackTop.vue";
import { reactive, ref } from "@vue/reactivity";
import { getCategoryData, getCategoryGoods } from "network/category.js";
import { computed, onMounted, watchEffect, nextTick } from "@vue/runtime-core";
import BScroll from "better-scroll";
import { useRouter } from "vue-router";
import { Toast } from "vant";

export default {
  name: "Category",
  setup() {
    let active = ref(0);
    let categories = ref([]);
    let activeName = ref(0);
    let activekey = ref(0);

    //当前的排序条件
    let currentOrder = ref("sales");
    //当前的分类Id
    let currentCid = ref(0);
    //回到顶部按钮显示
    let isShow = ref(false);

    const router = useRouter();

    let itemClick = (id) => {
      router.push({ path: "/detail", query: { id } });
    };

    let goods = reactive({
      sales: { page: 1, list: [] },
      price: { page: 1, list: [] },
      comments_count: { page: 1, list: [] },
    });

    const showGoods = computed(() => {
      return goods[currentOrder.value].list;
    });

    const init = () => {
      getCategoryGoods("sales", currentCid.value).then((res) => {
        goods.sales.list = res.goods.data;
      });
      getCategoryGoods("price", currentCid.value).then((res) => {
        goods.price.list = res.goods.data;
      });
      getCategoryGoods("comments_count", currentCid.value).then((res) => {
        goods.comments_count.list = res.goods.data;

        Toast.clear();
      });
    };

    let bscroll = reactive({});

    onMounted(() => {
      Toast.loading("加载中...");
      getCategoryData().then((res) => {
        categories.value = res.categories;
      });

      init();

      //创建BetterScroll对象
      bscroll = new BScroll(document.querySelector(".goodslist"), {
        probeType: 3, //0,1,2,3   3是只要在运动就触发scroll事件
        click: true, //是否允许点击
        pullUpLoad: true, //上拉加载更多，默认是false
      });

      //触发滚动事件
      bscroll.on("scroll", (position) => {
        //console.log(-position.y);
        //console.log(banref.value.offsetHeight);
        isShow.value = -position.y > 200;
      });

      //上拉加载数据，触发pullingUp
      bscroll.on("pullingUp", () => {
        //console.log('上拉加载更多');

        let page = goods[currentOrder.value].page + 1;

        getCategoryGoods(currentOrder.value, currentCid.value, page).then(
          (res) => {
            goods[currentOrder.value].list.push(...res.goods.data);
            goods[currentOrder.value].page += 1;
          }
        );
        //完成上拉，等数据加载完成，要将新数据显示出来
        bscroll.finishPullUp();

        //console.log("contentheight:"+document.querySelector('.content').clienHeight);
        //console.log('当前类型:' + currentType.value + '，当前页:' + page);
        //重新计算高度
        bscroll.refresh();
      });
    });

    //监听 任何一个变量有变化
    watchEffect(() => {
      //重新计算高度
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    });

    //排序选项卡
    const tabClick = (index) => {
      let orders = ["sales", "price", "comments_count"];

      currentOrder.value = orders[index];
      // console.log('当前分类id:'+currentCid.value);
      // console.log('排序的序号:'+currentOrder.value);
      getCategoryGoods(currentOrder.value, currentCid.value).then((res) => {
        goods[currentOrder.value].list = res.goods.data;
      });
    };

    const getGoods = (cid) => {
      currentCid.value = cid;
      // console.log('当前分类id:'+currentCid.value);
      // console.log('排序的序号:'+currentOrder.value);
    };

    const bTop = () => {
      bscroll.scrollTo(0, 0, 300);
    };

    return {
      active,
      categories,
      activeName,
      activekey,
      tabClick,
      currentOrder,
      getGoods,
      currentCid,
      goods,
      showGoods,
      bscroll,
      watchEffect,
      bTop,
      isShow,
      itemClick,
    };
  },
  components: {
    NavBar,
    BackTop,
  },
};
</script>

<style scoped lang="scss">
.mainbox {
  margin-top: 50px;
  width: 100%;
  height: auto;
  .ordertab {
    position: fixed;
    width: 70%;
    height: 45px;
    left: 30%;
    z-index: 10;
  }
  .leftmenu {
    position: fixed;
    width: 30%;
    height: auto;
    top: 90px;
    left: 0;
  }
  .goodslist {
    position: absolute;
    width: 70%;
    height: 100vh;
    left: 30%;
    top: 95px;
    padding: 10px;
    text-align: left;
    .content {
    }
  }
}
</style>
