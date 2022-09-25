<template>
    <van-swipe v-if="banners.length" :autoplay="3000" indicator-color="#42b983">
        <van-swipe-item v-for="(item,index) in banners.slice(0,4)" :key="index">
            <img v-lazy="item.img_url">
        </van-swipe-item>
    </van-swipe>
</template>
<script>

export default({
    name:'HomeSwipe',
    setup() {
        
    },
    props:{
        banners:{
            type:Array,
            default(){
                return []
            }
        }
    }
})
</script>

<style scoped>
    img{
        width: 100%;
        height: auto;
    }
</style>