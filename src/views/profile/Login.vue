<template>
    <div>
         <nav-bar>
            <template v-slot:default>用户登录</template>
        </nav-bar>
        <div style="text-align:center; margin-top:50px; padding-top: 40px;">
            <img class="img" src="~assets/images/title.jpg" alt="">
        </div>
        <div>
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                    v-model="email"
                    name="email"
                    label="邮箱"
                    placeholder="邮箱"
                    :rules="[{ required: true, message: '请填写邮箱' }]"
                    />
                    <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                    />
                </van-cell-group>
                <div style="margin: 16px;">
                    <div class="link-login" @click="$router.push({path:'/register'})">没有账号？立即注册</div>
                    <van-button round block type="primary" color="#42b983" native-type="submit">
                    登录
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import { login } from 'network/user.js';
import { reactive,toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useStore } from 'vuex';

export default {
    name:'Login',
    setup() {
        const router = useRouter();
        const store = useStore();

        const userinfo = reactive({
            email:(''),
            password:(''),
        })

        const onSubmit = () => {
            Toast.loading('加载中...')
        //console.log('submit', values);
            login(userinfo).then(res=>{
                //将token保存在本地 window.localStorage  setItem(key,value) getItem(key)
                window.localStorage.setItem('token',res.access_token);
                store.commit('setIsLogin',true)
                Toast.success('登陆成功');
                Toast.clear();

                userinfo.email = '';
                userinfo.password = '';

                setTimeout(()=>{
                    router.go(-1)
                },500)
                //在vuex  isLogin 保存临时的token

            })
        };

        return {
            ...toRefs(userinfo),
            onSubmit,
        }
    },
    components:{
        NavBar,
    }
}
</script>
<style scoped>
    .img{
        width: 100px;
        margin-bottom: 20px;
        border-radius: 5px;
    }
    .link-login{
        margin-bottom: 15px;
        font-size: 14px;
        color: #42bBaa;
        display: inline-block;
        float: left;
        padding-left: 15px;
    }
</style>