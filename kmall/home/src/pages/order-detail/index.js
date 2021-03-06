require('./index.css')
require('pages/common/nav')
require('pages/common/search')
var _side = require('pages/common/side')
require('pages/common/footer')
var api = require('api');
var hogan = require('hogan.js');
var _util = require('util');
var orderDetailTpl = require('./orderDetail.tpl')

var page = {
    init:function(){
        this.$elem = $('.order-box');
        this.renderSide()
        this.loadOrderDetail()
        this.bindEvent()
    },
    ordersDetailParams:{
        orderNo:_util.getParamFromUrl('orderNo') || '',
    },
    renderSide:function(){
        _side.render('order-list')
    },
    loadOrderDetail:function(order){
        var _this = this;
        api.getOrdersDetail({
            data:this.ordersDetailParams,
            success:function(order){
                if(order){
                    order.createdTime = new Date(order.createdAt).toLocaleString()
                    order.canPay = order.canCancel = order.status == 10;//未支付状态可以去支付也可以去取消
                    
                    var html = _util.render(orderDetailTpl,order,hogan)
                    _this.$elem.html(html)
                }
            },
            error:function(){
                _this.$elem.html('<p class="empty-message">手动更改可能拿不到数据</p>')
            }
        })
    },
    bindEvent:function(){
        var _this = this;
        this.$elem.on('click','.btn-cancel',function(){
            if(_util.showConfirm('您确定要删除订单吗？')){
                var $this = $(this);

                api.updateOrdersStatus({
                    data:{
                        orderNo:$this.data('order-no'),
                        status:20
                    },
                    success:function(order){
                        _this.loadOrderDetail(order)
                    },
                    error:function(msg){
                        _util.showErrorMessage(msg)
                    }
                })
            }
        })
    }
}

page.init()