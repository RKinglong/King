<template>
    <div class="recommend">
        <div class="recommend-item" v-for="item in recommends.slice(0,4)" :key="item.id">
            <a href="" @click.prevent="goDetail(item.id)">
                <img v-lazy="item.cover_url" alt="">
                <div>{{item.title}}</div>
            </a>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    name:'RecommendView',
    props:{
        recommends:{
            type:Array,
            default(){
                return []
            }
        }
    },
    setup() {
        const router = useRouter()
        
        let goDetail = (id)=>{
            router.push({path:'/detail',query:{id}})
        }

        return {
            goDetail
        }
    },
}
</script>

<style scoped lang='scss'>
    .recommend{
        display: flex;
        width: 100%;
        height: auto;
        text-align: center;
        //上右下左
        padding: 20px 0px 20px;
        border-bottom: 5px solid #EEE;
        font-size: 12px;
    }
    .recommend-item{
        flex: 1;
        img{
            width: 70px;
            height: 70px;
            margin-bottom: 10px;
        }
    }
</style>