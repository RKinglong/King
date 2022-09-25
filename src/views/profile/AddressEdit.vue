<template>
    <div>
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>{{title}}</template>
        </nav-bar>
        <div class="address-edit">
          <van-address-edit
          :area-list="areaList"
          :address-info="addressinfo"
          :show-delete="type == 'edit'"
          show-set-default
          show-search-result
          :area-columns-placeholder="['请选择', '请选择', '请选择']"
          @save="onSave"
          @delete="onDelete"
        />
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from 'vue';
import { Toast } from 'vant';
import { areaList } from '@vant/area-data';
import { addAddress,EditAddress,deleteAddress,getAddressDetail } from 'network/address';
import NavBar from 'components/common/navbar/NavBar.vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name:'AddressEdit',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      addressinfo:{},
      type:'add',
      addressId:'',
      title:''
    })

    onMounted(()=>{
      const {type,addressId} = route.query;
      state.type = type;
      state.addressId = addressId;

      if(type == 'edit'){
        getAddressDetail(addressId).then(res=>{
          //console.log(res);
          const addressDetail = res

          let _areaCode = ''
          let id = Object.keys(areaList.province_list);//将省份里的键拿出来定义为数组
          let text = Object.values(areaList.province_list);//将省份里的值拿出来定义为数组
          let province = [];
          //循环遍历
          for(let i = 0;i<id.length;i++){
            let obj = {};
            obj.id = id[i];
            obj.text = text[i];
            province.push(obj);
          }
          //console.log(province);

          // Object中entries属性可以拿到键和值
          // 区-市-省，反着拿
          Object.entries(areaList.county_list).forEach(([id, text]) => {
            // 先找出当前对应的区
            if (text == addressDetail.county) {
              // 找到区对应的几个省份
              const provinceIndex = province.findIndex(
                item => item.id.substr(0, 2) == id.substr(0, 2)
              );
              // 找到区对应的几个市区
              const cityItem = Object.entries(areaList.city_list).filter(
                ([cityId, city]) => cityId.substr(0, 4) == id.substr(0, 4)
              )[0];
              // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
              if (
                province[provinceIndex].text == addressDetail.province &&
                cityItem[1] == addressDetail.city
              ) {
                _areaCode = id;
              }
            }
          });

          state.addressinfo = {
            name:addressDetail.name,
            tel:addressDetail.phone,
            province:addressDetail.province,
            city:addressDetail.city,
            county:addressDetail.county,
            areaCode:_areaCode,
            addressDetail:addressDetail.address,
            isDefault: !!addressDetail.is_default
          }
        })
      }
    })

    // 保存地址信息
    const onSave = (content) => {
      // 保存数据存放到参数中
      //console.log(content);
      const params = {
        name: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        address: content.addressDetail,
        is_default: content.isDefault ? 1 : 0, // 判断是否为默认地址
      };
      // 如果类型为 编辑 状态
      if (state.type == "edit") {
        // 调用 修改数据接口
        EditAddress(state.addressId, params); // params传递修改好的数据
      } else if (state.type == "add") {
        // 调用 添加数据接口
        addAddress(params);
      }
      // 轻提示
      Toast("保存成功");
      setTimeout(() => {
        router.back();
      }, 1000);
    };

    const onDelete = () => {
      deleteAddress(state.addressId).then(res=>{
        Toast('删除成功！');
        setTimeout(()=>{
          router.back();
        },1000)
      })
    };

    const title = computed(()=>{
      return state.type == 'add' ? '新增地址' : '编辑地址';
    })

    return {
      onSave,
      onDelete,
      areaList,
      ...toRefs(state),
      title
    };
  },
  components:{
      NavBar
  }
};
</script>

<style scoped lang="scss">
  .address-edit{
    margin-top: 50px;
  }
</style>