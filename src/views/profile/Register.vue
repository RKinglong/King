<template>
    <div>
         <nav-bar>
            <template v-slot:default>用户注册</template>
        </nav-bar>
        <div style="text-align:center; margin-top:50px; padding-top: 40px;">
            <van-image
                width="10rem"
                height="10rem"
                fit="contain"
                src="https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            />
        </div>
        <div>
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                    v-model="name"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                    />
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
                    <van-field
                    v-model="password_confirmation"
                    type="password"
                    name="确认密码"
                    label="确认密码"
                    placeholder="确认密码"
                    :rules="[{ required: true, message: '请确认密码' }]"
                    />
                </van-cell-group>
                <div style="margin: 16px;">
                    <div class="link-login" @click="$router.push({path:'/login'})">已有账号，立即登录</div>
                    <van-button round block type="primary" color="#42b983" native-type="submit">
                    注册
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import { register } from 'network/user.js';
import { ref,reactive,toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'vant';
import { Toast } from 'vant';
export default {
    name:'Register',
    setup() {
        const router = useRouter();

        const userinfo = reactive({
            name:(''),
            email:(''),
            password:(''),
            password_confirmation:('')
        })
        const onSubmit = (values) => {
        //console.log('submit', values);
            if(userinfo.password != userinfo.password_confirmation){
                Notify('两次密码输入不一致');
            }else{
                Toast.loading('加载中...')
                register(userinfo).then(res=>{
                    console.log(res);
                    if(res.status == '201')
                        Toast.success('注册成功')
                        Toast.clear();
                        
                    userinfo.password = ''
                    userinfo.password_confirmation = ''
                    
                    setTimeout(()=>{
                        router.push({path:'/login'})
                    },1000)
                })
            }
        };

        return {
            ...toRefs(userinfo),
            onSubmit
        }
    },
    components:{
        NavBar,
    }
}
</script>
<style scoped>
    .link-login{
        margin-bottom: 15px;
        font-size: 14px;
        color: #42bBaa;
        display: inline-block;
        float: left;
        padding-left: 15px;
    }
</style>