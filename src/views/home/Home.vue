<template>
    <div id="home">
        <nav-bar>
            <template v-slot:left></template>
            <template v-slot:default>图书兄弟</template>
        </nav-bar>
        <tab-control v-show="isShow" @tabClick='tabClick' :titles="['畅销','新书','精选']"></tab-control>
        <div class="wrapper">
            <div class="content">
                <div ref="banref">
                    <home-swipe :banners="banners"></home-swipe>
                    <recommend-view :recommends='recommends'></recommend-view>
                </div>
                <tab-control @tabClick='tabClick' :titles="['畅销','新书','精选']"></tab-control>

                <goods-list :goods="showGoods"></goods-list>
            </div>
        </div>
        <back-top @bTop="bTop" v-show="isShow"></back-top>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import RecommendView from "./ChildComps/RecommendView.vue";
import TabControl from 'components/content/tabControl/TabControl.vue'
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/common/backtop/BackTop.vue";
import HomeSwipe from './ChildComps/HomeSwipe.vue';
import {onMounted, ref,reactive, computed, nextTick, watchEffect} from 'vue';
import {getHomeAllData,getHomeGoods} from 'network/home.js';
import BScroll from 'better-scroll';
import { Toast } from 'vant';

export default {
    name:'Home',
    setup() {
        const recommends = ref([]);

        let isShow = ref(false);
        let banref = ref(null);

        //商品列表数据模型
        let goods = reactive({
            sales:{page:1,list:[]},
            recommend:{page:1,list:[]},
            new:{page:1,list:[]},
        })

        let currentType = ref('sales');

        const showGoods = computed(()=>{
            return goods[currentType.value].list
        })

        const tabClick = (index)=>{

            let types = ['sales','new','recommend'];

            currentType.value = types[index];
        }

        let bscroll = reactive({});
        let banners = ref([]);
        
        onMounted(()=>{
            Toast.loading('加载中...');
            getHomeAllData().then(res=>{
                recommends.value = res.goods.data;
                banners.value = res.slides;
            }).catch(err=>{

            });

            getHomeGoods('sales').then(res=>{
                goods.sales.list = res.goods.data
            }).catch(err=>{

            });
            getHomeGoods('recommend').then(res=>{
                goods.recommend.list = res.goods.data
                
            }).catch(err=>{

            });
            getHomeGoods('new').then(res=>{
                goods.new.list = res.goods.data
                
                Toast.clear()
            }).catch(err=>{

            });

            //创建BetterScroll对象
            bscroll = new BScroll(document.querySelector('.wrapper'),{
                probeType: 3, //0,1,2,3   3是只要在运动就触发scroll事件
                click:true,  //是否允许点击
                pullUpLoad:true, //上拉加载更多，默认是false
            });

            
            //触发滚动事件
            bscroll.on('scroll',(position)=>{
                //console.log(-position.y);
                //console.log(banref.value.offsetHeight);
                isShow.value = (-position.y) > banref.value.offsetHeight;
            })

            //上拉加载数据，触发pullingUp
            bscroll.on('pullingUp',()=>{
                //console.log('上拉加载更多');
                
                let page = goods[currentType.value].page+1;

                getHomeGoods(currentType.value,page).then(res=>{
                    goods[currentType.value].list.push(...res.goods.data);
                    goods[currentType.value].page +=1 ;
                })

                //完成上拉，等数据加载完成，要将新数据显示出来
                bscroll.finishPullUp();

                //console.log("contentheight:"+document.querySelector('.content').clienHeight);
                //console.log('当前类型:' + currentType.value + '，当前页:' + page);
                //重新计算高度
                bscroll.refresh();
            })
        })

        
        //监听 任何一个变量有变化
        watchEffect(()=>{
            //重新计算高度
            nextTick(()=>{
                bscroll && bscroll.refresh();
            })
        })

        //回到顶部
        const bTop = ()=>{
            bscroll.scrollTo(0,0,500)//x,y,时间
        }
        

        return {
            recommends,
            tabClick,
            goods,
            showGoods,
            banref,
            isShow,
            bTop,
            banners,
        }
    },
    components:{
        NavBar,
        RecommendView,
        TabControl,
        GoodsList,
        BackTop,
        HomeSwipe
    },
}
</script>

<style scoped>
    .banners img{
        width: 100%;
        height: auto;
    }
    #home{
        height: 100vh;
        position: relative;
    }
    .wrapper{
        position: absolute;
        top: 45px;
        bottom: 50px;
        left: 0%;
        right: 0%;
        overflow: hidden;
    }
    .content{

    }
</style>