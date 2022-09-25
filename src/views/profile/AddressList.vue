<template>
    <div>
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>我的地址</template>
        </nav-bar>
        <div class="address-list">
            <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
            />
        </div>
        <div v-show="list.length == 0">
          <div style="font-size:20px">
            当前还没有地址，去添加~
          </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import NavBar from 'components/common/navbar/NavBar.vue';
import { useRouter } from 'vue-router';
import {getAddressList} from 'network/address';
import { Toast } from 'vant';

export default {
  setup() {
    const router = useRouter();
    const state = reactive({
      chosenAddressId:'1',
      list:[]
    })

    onMounted(()=>{
      Toast.loading('加载中...')
      getAddressList().then(res=>{
        //console.log(res);
        if(res.data.length == 0){
          state.list = []
          return;
        }else{
          state.list = res.data.map(item=>{
            return {
              id:item.id,
              name:item.name,
              tel:item.phone,
              address:`${item.province} ${item.city} ${item.county} ${item.address}`,
              isDefault:!!item.is_default //将1 0 转换为true false
            }
          })
        }
        Toast.clear()
      })
    })

    /*const disabledList = [
      {
        id: '3',
        name: '王五',
        tel: '1320000000',
        address: '浙江省杭州市滨江区江南大道 15 号',
      },
    ];*/

    const onAdd = ()=>{
        router.push({path:'/addressedit',query:{type:'add'}})
    };
    const onEdit = (item)=>{
        router.push({path:'/addressedit',query:{type:'edit',addressId: item.id}})
    };

    return {
      ...toRefs(state),
      onAdd,
      onEdit,
      //disabledList,
    };
  },
  components:{
      NavBar,
  }
};

</script>

<style lang="scss">
    .address-list{
        margin-top: 50px;
        .van-address-list__bottom{
            bottom: 10% !important;
        }
    }
</style>