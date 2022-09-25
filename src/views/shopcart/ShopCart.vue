<template>
    <div>
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>购物车({{$store.state.cartCount}})</template>
        </nav-bar>
        <div class="shop-cart">
            <van-checkbox-group v-model="result" @change="groupChange">
                <van-swipe-cell class="swipe-cell"
                v-for="(item,index) in list" :key="index">
                    <div class="check-box">
                        <van-checkbox :name="item.id"/>
                        <div class="good-img">
                            <img :src="item.goods.cover_url" alt="">
                        </div>
                        <div class="good-item">
                            <div class="title">
                                <span>{{item.goods.title}}</span>
                                <span class="stock">x{{item.goods.stock}}</span>
                            </div>
                            <div class="price-stepper">
                                <div class="price"><small>￥{{item.goods.price+'.00'}}</small></div>
                                <van-stepper class="stepper" :min="1" :max="10" :model-value="item.num" :name="item.id" integer
                                @change="onChange" />
                            </div>
                        </div>
                    </div>
                    <template #right>
                        <van-button
                        square text="删除"
                        type="danger" 
                        class="delete-button"
                        @click="deleteGood(item.id)"
                        />
                    </template>
                </van-swipe-cell>
            </van-checkbox-group>
            <div class="van-submit-bar">
                <van-submit-bar :price="total * 100" button-text="结算" @submit="onSubmit">
                    <van-checkbox @click="allCheck" v-model="checkAll">全选</van-checkbox>
                </van-submit-bar>
            </div>
            <div class="empty" v-if="!list.length">
                <div>购物车空空如也~</div>
                <van-button style="background:#42b983" @click="goTo">去购物</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { reactive, toRefs } from '@vue/reactivity';
import { getCart,deleteCartItem,checkedCart,modifyCart } from "network/cart";
import { computed, onMounted } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useStore } from 'vuex';

export default {
    name:'ShopCart',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const store = useStore();

        //数据模型，状态
        const state = reactive({
            list:[],
            result:[], //购物车的id数组
            checkAll:true
        })

        //去购物
        const goTo = ()=>{
            router.push({path:'/'})
        }

        //异步改变购物车数量
        const onChange = (value,detail) => {
            // console.log(value);
            // console.log(detail.name);
            Toast.loading({message:'加载中...',forbidClick:true});
            modifyCart(detail.name,{num:value}).then(res=>{
                state.list.forEach(item => {
                    if(item.id == detail.name){
                        item.num = value
                    }
                })
                Toast.clear();
            })
        }

        //初始化购物车数据
        const init = ()=>{
            Toast.loading({message:'加载中...',forbidClick:true});
            getCart('include=goods').then(res=>{
                //console.log(res.data);
                state.list = res.data;
                state.result = res.data.filter(n => n.is_checked == 1).map(n => n.id)
                //store.dispatch('updateCart') //改版vuex中的状态的数量
                Toast.clear();
            })
        }

        //复选框改变处理
        const groupChange = (result)=>{
            if(result.length == state.list.length){
                state.checkAll = true;
            }else{
                state.checkAll = false;
            }

            //console.log(result);

            //改变数据表中的选中状态
            checkedCart({cart_ids:result});
        }

        //全选商品
        const allCheck = ()=>{
            if(state.checkAll){
                state.result = state.list.map(item => item.id)
            }else{
                state.result = []
            }
        }

        //删除商品
        const deleteGood = (cart)=>{
            deleteCartItem(cart).then(res=>{
                init(); //重新加载数据
                store.dispatch('updateCart') //改版vuex中的状态的数量
            })
        }

        //通过计算属性 计算总价
        const total = computed(()=>{
            let sum = 0;
            state.list.filter(item => state.result.includes(item.id))
            .forEach(item=>{
                sum += parseInt(item.num) * parseFloat(item.goods.price);
            })

            return sum;
        })

        //创建订单
        const onSubmit = ()=>{
            if(state.result.length == 0){
                Toast.fail({message:'请选择要购买的商品',forbidClick:false,duration:500});
                return;
            }else{
                router.push({path:'/createorder'})
            }
        }

        onMounted(()=>{
            init()
        })

        return {
            ...toRefs(state),
            goTo,
            onChange,
            groupChange,
            allCheck,
            deleteGood,
            total,
            onSubmit
        }
    },
    components:{
        NavBar
    }
}
</script>

<style scoped lang="scss">
    .shop-cart{
        margin-top: 60px;
        margin-bottom: 100px;
        padding-bottom: 10px;
        .empty{
            position: absolute;
            font-size: 20px;
            top: 45%;
            left: 30%;
        }
        .delete-button {
            height: 100%;
        }
        .swipe-cell{
            margin-top: 10px;
            margin-left: 15px;
        }
        .check-box{
            display: flex;
            .good-img{
                margin-left: 10px;
                img{
                    width: 100px;
                    height: auto;
                }
            }
            .good-item{
                padding: 10px;
                text-align: left;
                .title{
                    display: flex;
                    .stock{
                        position: absolute;
                        right: 15px;
                        font-size: 10px;
                    }
                }
                .price-stepper{
                    margin-top: 35px;
                    display: flex;
                    .price{
                        flex:1;
                        color:red;
                        padding-top:5px ;
                    }
                    .stepper{
                        flex:1;
                        position: absolute;
                        right: 10px;
                    }
                }
            }
        }
        .van-submit-bar{
            bottom: 50px;
            z-index: 10;
        }
    }
</style>