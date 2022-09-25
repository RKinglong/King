<template>
    <div>
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>订单详情</template>
        </nav-bar>
        <div class="orderdetail-mainbox">
            <div class="order-info">
                <div class="line-h">
                    <span class="font-color">订单状态：</span><span>{{statusString}}</span>
                </div>
                <div class="line-h">
                    <span class="font-color">订单编号：</span><span>{{detail.order_no}}</span>
                </div>
                <div class="line-h">
                    <span class="font-color">下单时间：</span><span>{{detail.created_at}}</span>
                </div>
            </div>
            <div class="button">
                <van-button v-if="detail.status == '1'" type="primary" block @click="showPay">去支付</van-button>
                <van-button v-if="detail.status == '2'" plain block style="margin-top:10px" @click="handleConfirmOrder">确认订单</van-button>
            </div>
            <div class="order-info">
                <div class="line-h">
                    <span class="font-color">商品金额：</span><span><small>￥</small>{{detail.amount+'.00'}}</span>
                </div>
                <div class="line-h">
                    <span class="font-color">配送方式：</span><span>普通快递</span>
                </div>
            </div>
            <div>
                <van-card v-for="item in detail.orderDetails.data" :key="item.id"
                :num="item.num"
                :price="item.price+'.00'"
                desc="畅销"
                :title="item.goods.title"
                :thumb="item.goods.cover_url"
                />
            </div>
            <van-popup
            v-model:show="show"
            closeable
            close-icon-position="top-right"
            position="bottom"
            :style="{ height: '30%' }"
            >
                <van-grid :border="false" :column-num="2">
                    <van-grid-item>
                        支付宝二维码<br>
                        <van-image width="150px" height="150px" :src="aliyun" />
                    </van-grid-item>
                    <van-grid-item>
                        微信二维码<br>
                        <van-image width="150px" height="150px" :src="wechat" />
                    </van-grid-item>
                </van-grid>
            </van-popup>
        </div>
    </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { reactive, toRefs } from '@vue/reactivity';
import { computed, onMounted } from '@vue/runtime-core';
import { getOrderDetail,payOrder,payOrderStatus,confirmOrder } from 'network/order';
import { Dialog, Toast } from 'vant';

export default {
    name:'orderDetail',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const state = reactive({
            orderId:'', //订单id
            detail:{
                orderDetails:{
                    data:[]
                },
                status:''
            },
            show:false,
            aliyun:'',
            wechat:''
        });

        const init = ()=>{
            const {id} = route.query;
            state.orderId = id;

            getOrderDetail(id).then(res=>{
                //console.log(res);
                state.detail = res;
                Toast.clear()
            })
        }

        onMounted(()=>{
            Toast.loading({message:'加载中...',forbidClick: true})
            init()
        })

        //订单状态
        const statusString = computed(()=>{
            // 1下单 2支付 3发货 4收货 5过期
            let status = ['','未支付','已支付','已发货','确认收货','已过期']
            
            return status[state.detail.status]
        })

        const showPay = ()=>{
            state.show = true;
            
            payOrder(state.orderId,{type:'aliyun'}).then(res=>{
                state.aliyun = res.qr_code_url
                state.wechat = res.qr_code_url
            });

            const timer = setInterval(()=>{
                payOrderStatus(state.orderId).then(res=>{
                    if(res == '2'){
                        clearInterval(timer);
                        state.show = false;
                        router.push({path:'orderDetail',query:{id:state.orderId}})
                    }
                })
            },1000)
        }

        const handleConfirmOrder = ()=>{
            Dialog.confirm({
                title:'是否确认收货',
            }).then(()=>{
                confirmOrder(state.orderId).then(res=>{
                    console.log(res);
                    if(res.status_code == '204'){
                        Toast('确认收货成功');
                        init();
                    }
                })
            }).catch(()=>{

            })
        }

        return {
            ...toRefs(state),
            statusString,
            showPay,
            handleConfirmOrder
        }
    },
    components:{
        NavBar
    }
}
</script>

<style lang="scss" scoped>
    .orderdetail-mainbox{
        margin-top: 50px;
        text-align: left;
        .order-info{
            padding: 20px;
        }
        .line-h{
            line-height: 30px;
        }
        .font-color{
            color:#c1c0b9;
        }
        .button{
            padding:10px 40px 10px 40px ;
            border-bottom: 1px solid #c1c0b9;
        }
    }
</style>>