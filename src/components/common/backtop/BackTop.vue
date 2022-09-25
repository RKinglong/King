<template>
    <div class="backTop" @click="backtop"></div>
</template>
<script>
export default {
    name:'BackTop',
    setup(props,context) {
        return {
            backtop:()=>{
                context.emit('bTop')
            }
        }
    },
}
</script>
<style scoped>
    .backTop{
        width: 32px;
        height: 32px;
        position: fixed;
        bottom: 80px;
        right: 30px;
        border-radius: 50%;
        box-shadow: 2px 2px 5px rgb(141, 141, 141);
        background:white url('~assets/images/up.png') no-repeat center center;
    }
</style>