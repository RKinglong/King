<template>
    <div class="nav-bar">
        <div @click="goback" class="left">
            <slot name="left">
                <img src="~assets/images/left.png" alt="">
            </slot>
        </div>
        <div class="center"><slot></slot></div>
        <div class="right"><slot name="right"></slot></div>
    </div>
</template>

<script>
import {useRouter} from 'vue-router';

export default {
    name:'NavBar',
    setup() {
        const router = useRouter();

        const goback = ()=>{
            router.go(-1)
        }

        return {
            goback
        }

    },
}
</script>

<style scoped>
    .nav-bar{
        display: flex;
        background-color: var(--color-tint);
        color: white;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 10;
        height: 45px;
        line-height: 45px;
        text-align: center;
        box-shadow: 0 2px 5px rgb(129, 129, 129);
    }
    .left, .right{
        width:60px
    }
    .center{
        flex: 1;
    }
    .left img{
        width: 40px;
        padding: 10px;
        vertical-align: middle;
    }
</style>