import {request} from './request.js'

export function getCategoryData(){
    return request({
        url:'/api/goods',
        /*method:'get',
        params:{
            
        }*/
    })
}
export function getCategoryGoods(order='sales',cid=0,page=0){
    return request({
        url:'/api/goods?category_id='+cid+'&page='+page+'&'+order+'=1',
        /*method:'get',
        params:{
            
        }*/
    })
}