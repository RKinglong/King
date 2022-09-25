<template>
    <div class="tab-control">
        <div v-for="(item,index) in titles" 
            :key="index"
            @click="itemClick(index)"
            class="tab-control-item" :class="{active:index == currentIndex}">
            <span>{{item}}</span>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
export default {
    setup(props,context) {
        let currentIndex = ref(0)

        const itemClick = (index)=>{
            currentIndex.value = index
            context.emit('tabClick',index)
        }

        return {
            currentIndex,
            itemClick
        }
    },
    props:{
        titles:{
            type:Array,
            default(){
                return []
            }
        }
    }
}
</script>

<style scoped lang='scss'>
    .tab-control{
        display: flex;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        text-align: center;
        background-color: skyblue;
        width: 100%;

        position: sticky;
        top: 44px;
        z-index: 10;

        .tab-control-item{
            flex:1;
            span{
                padding: 6px;
            }
        }
        .active{
            color: var(--color-tint);
            span{
                border-bottom: 5px solid var(--color-tint);
            }
        }
    }
</style>