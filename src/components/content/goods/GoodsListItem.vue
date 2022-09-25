<template>
    <div class="goods-item" @click="itemClick">
        <img v-lazy="product.cover_url" alt="">
        <div class="goods-info">
            <p>{{product.title}}</p>
            <span class="price"><small>￥</small>{{product.price}}</span>
            <span class="collect">{{product.collects_count}}</span>
        </div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router'
export default {
    name:'GoodsListItem',
    props:{
        product:Object,
        default(){
            return {}
        }
    },
    setup(props) {
        const router = useRouter();
        const itemClick = ()=>{
            router.push({path:'/detail',query:{id:props.product.id}})
        }

        return {
            itemClick
        }
    },
}
</script>
<style scoped lang='scss'>
    .goods-item{
        width: 40%;
        padding-bottom: 45px;
        margin-bottom: 45px;
        position: relative;
        img{
            width: 100%;
            height: auto;
        }
        .goods-info{
            font-size: 14px;
            position: absolute;
            bottom:5px;
            left:0;
            right: 0;
            overflow: hidden;
            p{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 5px;
            }
            .price{
                color:skyblue;
                margin-right: 30px;
            }
            .collect{
                position: relative;
            }
            .collect::before{
                content:'';
                width: 14px;
                height: 14px;
                position: absolute;
                left: -15px;
                background: url('~assets/images/shoucang.png') 0 0/14px 14px;
            }
        }
    }
</style>