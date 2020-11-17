import { message } from 'antd';
import * as types  from './actionTypes.js';
import api from 'api';

const getLoadingReqestStartAction = ()=>({
    type:types.LOADING_REQEST_START,
})

const getLoadingReqestDoneAction = ()=>({
    type:types.LOADING_REQEST_DONE,
})

const addCategoriesAction = (payload)=>({
    type:types.ADD_CATEGORIES,
    payload
})

const getSetPageAction = (payload)=>({
    type:types.ADD_CATEGORIES_LIST,
    payload
})

export const setMainImageAction = (payload)=>({
    type:types.HAND_MAIN_IMAGE,
    payload
})

export const setImagesAction = (payload)=>({
    type:types.HAND_IMAGES,
    payload
})

export const setDetailAction = (payload)=>({
    type:types.HAND_DETAIL,
    payload
})

export const setMainImageStatusAction = (payload)=>({
    type:types.HAND_MAIN_IMAGE_STATUS,
    payload
})


export const setImagesStatusAction = (payload)=>({
    type:types.HAND_IMAGES_STATUS,
    payload
})

export const setProductDetailAction = (payload)=>({
    type:types.SET_PRODUCT_DETAIL,
    payload
})

//添加分类
export const productSaveAction = (err,values)=>{
    return (dispatch,getState)=>{
        const state = getState().get('product');
        const mainImage = state.get('mainImage');
        const images = state.get('images');
        const detail = state.get('detail');

        let hasErr = false;//布尔值逻辑处理程序有错误终止与反之进行
        if(err){
            hasErr = true;
        }
        if(!mainImage){
            hasErr = true;
            dispatch(setMainImageStatusAction('error'))
        }
        if(!images){
            hasErr = true;
            dispatch(setImagesStatusAction('error'))
        }        

        if(hasErr){
            return;//有错误终止程序往下运行
        }

        dispatch(getLoadingReqestStartAction())
        api.addProducts({
            ...values,//扩展values这个对象方便与其他三个合并成新的对象
            mainImage,
            images,
            detail
        })
        .then(result=>{
            if(result.code == 1){
                message.success(result.message,2,function(){
                    window.location.href='/product'
                });
            }else{
                message.error(result.message,2);
            }
        })
        .catch(err=>{
            message.error('网络错误，请稍后再试！');
        })
        .finally(()=>{
            dispatch(getLoadingReqestDoneAction())
        })
    }
}

//将添加好的分类映射到form表单里
export const getLevelCategories = (level)=>{
    return (dispatch,getState)=>{
        api.getLevelCategories(level)
        .then(result=>{
            dispatch(addCategoriesAction(result.data));
        })
        .catch(err=>{
            message.error('网络错误，请稍后再试！');
        })
    }
}

//将上述的内容添加到展示页面
export const getProductPageAction = (page)=>{
    return (dispatch,getState)=>{
        dispatch(getLoadingReqestStartAction())
        api.getProductPage(page)
        .then(result=>{
            if(result.code == 1){
                // console.log(result)
                dispatch(getSetPageAction(result.data))
            }else{
            message.error('获取首页数据失败，请稍后再试！');
            }
        })
        .catch(err=>{
            message.error('网络错误，请稍后再试！');
        })
        .finally(()=>{
            dispatch(getLoadingReqestDoneAction())
        })

    }
}


//更新显示
export const handleIsShowAction = (newShow,id)=>{
    return (dispatch,getState)=>{
        const page = getState().get('product').get('current');
        api.updateProductsIsShowList(
            {
                isShow:newShow,
                id:id,
                page:page
            }
            )
        .then(result=>{
            if(result.code == 1){
                dispatch(getSetPageAction(result.data))
            }else{
                message.error('获取排序数据失败，请稍后再试！');
            }
        })
        .catch(err=>{
            message.error('网络错误，请稍后再试！');
        })
    }
}

//更新上下架状态
export const handleUpdateStatusAction = (newStatus,id)=>{
    return (dispatch,getState)=>{
        const page = getState().get('product').get('current');
        api.updateProductsStatusList(
            {
                status:newStatus,
                id:id,
                page:page
            }
            )
        .then(result=>{
            if(result.code == 1){
                dispatch(getSetPageAction(result.data))
            }else{
                message.error('获取排序数据失败，请稍后再试！');
            }
        })
        .catch(err=>{
            message.error('网络错误，请稍后再试！');
        })
    }
}

//更新热销滞销
export const handleUpdateHotAction = (newHot,id)=>{
    return (dispatch,getState)=>{
        const page = getState().get('product').get('current');
        api.updateProductsisHotList(
            {
                isHot:newHot,
                id:id,
                page:page
            }
            )
        .then(result=>{
            if(result.code == 1){
                dispatch(getSetPageAction(result.data))
            }else{
                message.error('获取排序数据失败，请稍后再试！');
            }
        })
        .catch(err=>{
            message.error('网络错误，请稍后再试！');
        })
    }
}

//更新排序
export const handleUpdateOrderAction = (newOrder,id)=>{
    return (dispatch,getState)=>{
        const page = getState().get('product').get('current');
        dispatch(getLoadingReqestStartAction())
        api.updateProductsOrderList(
            {
                order:newOrder,
                id:id,
                page:page
            }
            )
        .then(result=>{
            if(result.code == 1){
                message.success('更新排序成功',2,function(){
                    window.location.reload()
                });
            }else{
                message.error('获取排序数据失败，请稍后再试！');
            }
        })
        .catch(err=>{
            message.error('网络错误，请稍后再试！');
        })
        .finally(()=>{
            dispatch(getLoadingReqestDoneAction())
        })

    }
}

// 拿到id后获取detail内容
export const getProductDetailAction = (productId)=>{
    return (dispatch,getState)=>{
        api.getProductIdDetail({
            id:productId,
        })
        .then(result=>{
            if(result.code == 1){
                dispatch(setProductDetailAction(result.data))
            }else{
                message.error('获取排序数据失败，请稍后再试！');
            }
        })
        .catch(err=>{
            message.error('网络错误，请稍后再试！');
        })
    }
}