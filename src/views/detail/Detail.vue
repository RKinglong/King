<template>
    <div>
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>商品详情:{{id}}</template>
        </nav-bar>
        <van-image style="margin-top:50px"
            width="100%"
            lazy-load
            :src="detail.cover_url"
        />
        <van-card style="text-align:left"
            :num="detail.stock"
            :price="detail.price+'.00'"
            :desc="detail.description"
            :title="detail.title"
            >
            <template #tags>
                <van-tag plain type="danger">新书</van-tag>
                <van-tag plain type="danger">推荐</van-tag>
            </template>
            <template #footer>
                <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
                <van-button type="danger" @click="goTOCart">立即购买</van-button>
            </template>
        </van-card>
        <van-tabs class="info" v-model:active="active">
            <van-tab title="概述">
                <div class="content" v-html="detail.details"></div>
            </van-tab>
            <van-tab title="热评">
                <div class="content" v-for="item in detail.comments" :key="item.id">

                </div>
            </van-tab>
            <van-tab title="相关图书">
                <goods-list :goods="like_goods"></goods-list>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import { Notify, Toast } from 'vant';
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { toRefs } from "vue";
import { getDetailData } from "network/detail";
import { addCart } from "network/cart";
import { useStore } from 'vuex';

export default {
    name:'Detail',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()

        let id = ref(0);

        let active = ref(0);

        const books = reactive({
            detail:{},
            like_goods:{}
        })

        onMounted(()=>{
            Toast.loading('加载中...')
            id.value = route.query.id;

            getDetailData(id.value).then(res=>{
                //console.log(res);
                books.detail = res.goods;
                books.like_goods = res.like_goods

                Toast.clear();
            })
        })

        const handleAddCart = ()=>{
            addCart({goods_id:books.detail.id,num:1}).then(res=>{
                if(res.status == '201' || res.status == '204'){
                    Toast.success('加入成功');
                    //设置store中的cartCount
                    store.dispatch('updateCart')
                }
            })
        }

        const goTOCart = ()=>{
            addCart({goods_id:books.detail.id,num:1}).then(res=>{
                if(res.status == '201' || res.status == '204'){
                    //设置store中的cartCount
                    store.dispatch('updateCart')
                    router.push({path:'/shopcart'})
                }
            })
        }

        return {
            id,
            ...toRefs(books),
            active,
            handleAddCart,
            goTOCart
        }
    },
    components:{
        NavBar,
        GoodsList
    }
}
</script>

<style lang="scss">
.content{
    padding:10px;
    margin-bottom: 50px;
    img{
        max-width: 100%;
        height: auto;
    }
}
</style>