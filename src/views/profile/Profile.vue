<template>
    <div>
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>个人中心</template>
        </nav-bar>
        <div class="mainbox">
            <div class="person-info">
                <div class="info">
                    <img :src="user.avatar_url" alt="">
                    <div class="user-info">
                        <span>昵称：{{user.name}}</span>
                        <span>账号：{{user.email}}</span>
                        <span>个性签名：这个人很懒，什么都没有</span>
                    </div>
                </div>
            </div>
            <div class="ul-li">
                <ul>
                    <li @click="goTo('/collect')">
                        我的收藏<van-icon class="icon" name="arrow" />
                    </li>
                    <li @click="goTo('/order')">
                        我的订单<van-icon class="icon" name="arrow" />
                    </li>
                    <li @click="goTo('/setting')">
                        账号管理<van-icon class="icon" name="arrow" />
                    </li>
                    <li @click="goTo('/addresslist')">
                        地址管理<van-icon class="icon" name="arrow" />
                    </li>
                    <li @click="goTo('/about')">
                        关于我们<van-icon class="icon" name="arrow" />
                    </li>
                </ul>
            </div>
            <div class="exit">
                <van-button round block type="danger" @click="tologout">退出</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { logout,getUser } from "network/user";
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onMounted, reactive, toRefs } from '@vue/runtime-core';
import { areaList } from '@vant/area-data';

export default {
    name:'Profile',
    setup() {
        const router = useRouter();
        const store = useStore();

        const state = reactive({
            user:{}
        })

        onMounted(()=>{
            getUser().then(res=>{
                //console.log(res);
                state.user = res;
            })
        })

        const tologout = ()=>{
            logout().then(res=>{
                if(res.status == '204'){
                    Toast.success('退出成功');

                    //清除token window.localStorage.removeItem('token')
                    window.localStorage.removeItem('token')
                    store.commit('setIsLogin',false)

                    setTimeout(()=>{
                        router.push({path:'/login'})
                    },500)
                }
            })
        }

        //跳转方法
        const goTo = (path,query)=>{
            router.push({path,query:query || {}})
        }

        return {
            tologout,
            ...toRefs(state),
            goTo,
            areaList
        }
    },
    components:{
        NavBar,
    }
}
</script>

<style scoped lang="scss">
    .mainbox{
        margin:80px 20px 50px 20px;
        .person-info{
            padding: 10px;
            text-align: left;
            background: #42b983;
            border-radius: 10px;
            .info{
                display: flex;
                img{
                    width: 100px;
                    height: 100px;
                    border-radius: 5px;
                }
                .user-info{
                    color: white;
                    padding:10px 0px 10px 10px;
                    display: flex;
                    flex-direction: column;
                }
            }
        }
        .ul-li{
            margin-top: 20px;
            ul{
            line-height: 20px;
                li{
                    text-align: left;
                    padding-top: 30px;
                    padding-bottom: 30px;
                    .icon{
                        float: right;
                    }
                }
            }
        }
        .exit{
            margin-top: 100px;
        }
    }
    
</style>