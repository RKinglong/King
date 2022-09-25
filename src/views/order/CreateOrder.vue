<template>
  <div>
    <nav-bar>
      <template v-slot:left></template>
      <template v-slot:default>订单预览</template>
    </nav-bar>
    <div class="main-box">
      <div class="address-list" @click="goTo">
        <div class="address-list-info">
          <span class="name">{{ address.name }}</span>
          <span class="tel"
            >{{ address.phone }}<van-icon class="icon" name="arrow"
          /></span>
          <span
            >{{ address.province }}{{ address.city }}{{ address.county
            }}{{ address.address }}</span
          >
        </div>
      </div>
      <div class="good">
        <div class="good-info" v-for="(item, index) in cartList" :key="index">
          <div class="good-img">
            <img v-lazy="item.goods.cover_url" alt="" />
          </div>
          <div class="good-item">
            <div class="title">
              <span>{{ item.goods.title }}</span>
            </div>
            <div class="price">
              <span><small>￥</small>{{ item.goods.price + ".00" }}</span>
              <span class="num">x{{ item.num }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-submit-bar :price="total" button-text="提交订单" @submit="onSubmit" />
    <van-popup
      v-model:show="show"
      closeable
      close-icon-position="top-right"
      position="bottom"
      :style="{ height: '30%' }"
      @close="close"
    >
      <!-- <div :style="{ padding:'60px 30px 0 30px', }">
                <van-button color="#1989fa" block @click="showAliyunPopup">
                    支付宝支付
                </van-button>
                <van-popup v-model:show="showAliyun">
                    <div>
                        使用支付宝扫描二维码，向我付款<br>
                        <img v-lazy="aliyun" alt="">
                    </div>
                </van-popup>
                <van-button :style="{ marginTop:'20px' }" color="#4fc08d" block>
                    微信支付<small style="font-size:12px">(暂不支持)</small>
                </van-button>
            </div> -->
      <van-grid :border="false" :column-num="2">
        <van-grid-item>
          支付宝二维码<br />
          <van-image width="150px" height="150px" :src="aliyun" />
        </van-grid-item>
        <van-grid-item>
          微信二维码<br />
          <van-image width="150px" height="150px" :src="wechat" />
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { Toast } from "vant";
import { useRoute, useRouter } from "vue-router";
import {
  createOrder,
  getOrderPreview,
  payOrder,
  payOrderStatus,
} from "network/order";
import { reactive, toRefs } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  name: "CreateOrder",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      cartList: [],
      address: {},
      show: false,
      orderId: "",
      aliyun: "",
      wechat: "",
    });

    //const showAliyun = ref(false);
    //const showWechat = ref(false);
    /*const showAliyunPopup = ()=>{
            showAliyun.value = true
        }
        const showWechatPopup = ()=>{
            showWechat.value = true
        }*/

    const init = () => {
      getOrderPreview().then((res) => {
        //console.log(res);

        let address = res.address.filter((n) => n.is_default == 1);

        if (address == 0) {
          state.address = {
            address: "还没设置默认地址，请去设置或填写",
          };
        } else {
          state.address = address[0];
        }

        state.cartList = res.carts;

        Toast.clear();
      });
    };

    onMounted(() => {
      Toast.loading("加载中...");
      init();
    });

    const onSubmit = () => {
      const params = {
        address_id: state.address.id,
      };
      if (params.address_id === undefined) {
        Toast("还未填写地址，请先填写地址！");
      } else {
        createOrder(params).then((res) => {
          //   console.log(res);
          Toast("订单创建成功");
          store.dispatch("updateCart");

          //显示弹出层
          state.show = true;

          //订单id
          state.orderId = res.id;
          //生成二维码
          payOrder(state.orderId, { type: "aliyun" }).then((res) => {
            //console.log(res);
            state.aliyun = res.qr_code_url;
            state.wechat = res.qr_code_url;
          });

          /*payOrder(state.orderId,{type:'wechat'}).then(res=>{
                    state.wechat = res.qr_code_url
                })*/

          //轮询查看
          const timer = setInterval(() => {
            // 订单状态
            payOrderStatus(state.orderId).then((res) => {
              //console.log(res);
              if (res == "2") {
                // 停止轮询
                clearInterval(timer);
                state.show = false;
                // 支付成功后跳转到订单状态
                router.push({
                  path: "/orderdetail",
                  query: { id: state.orderId },
                });
              }
            });
          }, 2000);
        });
      }
    };

    const close = () => {
      router.push({ path: "/orderdetail", query: { id: state.orderId } });
    };

    const goTo = () => {
      router.push({ path: "/addresslist" });
    };

    const total = computed(() => {
      let sum = 0;
      state.cartList.forEach((item) => {
        sum += parseInt(item.num) * parseFloat(item.goods.price) * 100;
      });
      return sum;
    });

    return {
      onSubmit,
      goTo,
      ...toRefs(state),
      total,
      close,
      //showAliyun,
      //showWechat,
      //showAliyunPopup,
      //showWechatPopup,
    };
  },
  components: {
    NavBar,
  },
};
</script>

<style scoped lang="scss">
.main-box {
  margin-top: 55px;
  margin-bottom: 100px;
  .address-list {
    text-align: left;
    padding: 20px;
    border-bottom: 5px dashed #42bbaa;
    .address-list-info {
      display: flex;
      flex-flow: column;
    }
    .name {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 10px;
    }
    .tel {
      padding-bottom: 5px;
      .icon {
        float: right;
      }
    }
  }
  .good {
    margin-top: 20px;
    padding: 10px;
    .good-info {
      display: flex;
      margin-bottom: 10px;
      .good-img {
        img {
          width: 100px;
          height: auto;
        }
      }
      .good-item {
        padding: 10px;
        text-align: left;
        .title {
          font-size: 18px;
        }
        .price {
          margin-top: 45px;
          color: red;
          .num {
            position: absolute;
            right: 20px;
            color: black;
          }
        }
      }
    }
  }
}
.van-submit-bar {
  bottom: 51px;
  z-index: 10;
}
</style>
