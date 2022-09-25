<template>
    <div>
        {{banner}}
    </div>
</template>

<script>

import {onMounted, ref} from 'vue';
import {getHomeAllData} from 'network/home.js';

export default {
    setup() {
        let banner = ref([])
        
        onMounted(()=>{
            getHomeAllData().then(res=>{
                banner.value = res.goods.data[0].title
            }).catch(err=>{

            });
        })

        return {
            banner
        }
    },
}
</script>

<style scoped>

</style>