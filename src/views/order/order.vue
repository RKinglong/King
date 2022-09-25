<template>
    <div>
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>订单列表</template>
        </nav-bar>
        <div class="order-list">
            <van-tabs v-model:active="active" class="tabs" @click="onChange">
                <van-tab title="全部"></van-tab>
                <van-tab title="待付款"></van-tab>
                <van-tab title="已支付"></van-tab>
                <van-tab title="发货"></van-tab>
                <van-tab title="交易完成"></van-tab>
                <van-tab title="过期"></van-tab>
            </van-tabs>

            <div class="order-refresh">
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    offset="10"
                    >
                        <div v-for="(item,index) in list" :key="index"
                            class="order-info"  @click="goTo(item.id)">
                            <div class="order-title">
                                <span style="line-height:30px;">订单号：{{item.order_no}}<br>创建时间：{{item.created_at}}</span>
                            </div>
                            <van-card class="van-card" v-for="sub in item.orderDetails.data" :key="sub.id"
                            :num="sub.num"
                            :price="sub.price"
                            desc="畅销"
                            :title="sub.goods.title"
                            :thumb="sub.goods.cover_url"
                            />
                        </div>
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import NavBar from 'components/common/navbar/NavBar.vue'
import { onMounted } from '@vue/runtime-core'
import { useRouter,useRoute } from 'vue-router'
import {getOrderList} from 'network/order'

export default {
    name:'order',
    setup() {
        const router = useRouter();
        const route = useRoute();

        /*
        List 组件通过 loading 和 finished 两个变量控制加载状态，
        当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。
        此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
        若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
        */

        const state = reactive({
            active:'0',
            refreshing:false,
            loading:false,
            finished:false,
            list:[],
            page:'1',
            status:'0',
            totalPage:'0'
        })

        onMounted(()=>{
           onRefresh()  //初始化
        })

        const loadDate = ()=>{
            getOrderList({page:state.page,status:state.status,include:'orderDetails.goods'}).then(res=>{
                //console.log(res);
                state.list = state.list.concat(res.data);  //连接数据
                state.loading = false; //数据更新完，不再触发load事件

                if(state.page >= state.totalPage){
                    state.finished = true //加载完数据后停止加载
                }
            })
        }

        const onLoad = () => {

            if(state.page < state.totalPage && !state.refreshing){
                state.page += 1;
            }

            //初始化列表
            if(state.refreshing){
                state.list = [];
                state.refreshing = false
            }
            loadDate();
        };

        const onRefresh = () => {
            //是否处于加载状态，加载过程中不触发load事件
            state.refreshing = true;
            // 清空列表数据
            state.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            state.loading = true;

            //初始化到第一页
            state.page = '1'

            onLoad();
        };

        //切换选项卡
        const onChange = (name)=>{
            //console.log(name);
            state.status = name;
            onRefresh();
        }

        //跳转到订单详情页
        const goTo = (id)=>{
            router.push({path:'/orderdetail',query:{id}})
        }

        return {
            ...toRefs(state),
            onLoad,
            onRefresh,
            onChange,
            goTo
        }
    },
    components:{
        NavBar
    }
}
</script>

<style lang="scss" scoped>
    .order-list{
        margin-top: 45px;
        position: relative;
        .tabs{
            position: fixed;
            z-index: 10;
        }
        .order-refresh{
            position: absolute;
            width: 100vw;
            padding: 10px 10px 50px 10px;
            top: 40px;
            text-align: left;
            .order-info{
                margin-top: 30px;
                border-bottom: 2px solid #c1c0b9;
                .order-title{
                    padding: 10px;
                }
                .van-card{
                    margin-bottom: 20px;
                }
            }
        }
    }
    
</style>>