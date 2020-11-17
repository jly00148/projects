import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select,Breadcrumb,Spin,InputNumber } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const { Option } = Select;
import UploadImage from 'common/upload-image';
import { actionCreator } from './store';
import Layout from 'common/layout';
import { UPLOAD_PRODUCT_IMAGE,UPLOAD_PRODUCT_DATAILIMAGES } from 'api/config.js';
import RichEditor from 'common/richEditor';

class ProductSave extends Component {
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)
        this.state = {
            //组件加载完通过this.props.match.params.productId来获取参数即id值
            productId:this.props.match.params.productId
        }

    }

    componentDidMount(){
        this.props.handleLevelCategories()//不传参后台默认level=2
        if(this.state.productId){
            this.props.getProductDetail(this.state.productId)
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.handleSave(err,values);
        });
      };

    handleSelectChange (value) {
        this.props.form.setFieldsValue({
        });
    };

    render(){
        const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
        const { getFieldDecorator } = this.props.form;
        const { 
            isFetching,
            categories,
            handleMainImage,
            handleImages,
            handleDetail,
            validateStatus,
            help,
            validateStatus1,
            help1,
            category,
            name,
            description,
            price,
            stock,
            detail,
            mainImage,
            images      
        } = this.props

        
        //处理图片回填
        const mainImageFileList = [];
        let imagesFileList = [];
        if(mainImage){
            mainImageFileList.push({
                uid:'0',
                // status:'done',
                url:mainImage,
                response:{thumbUrl:mainImage}//点击图片方法查看，下同
            })
        }

        if(images){
            imagesFileList = images.split(',').map((url,index)=>{
                return {
                    uid:index,
                    status:'done',
                    url:url,
                    response:{thumbUrl:mainImage}
                }
            })
        }

        return(
            <Layout className="content">
                <Spin 
                    indicator={antIcon}
                    spinning={isFetching}
                    tip='正在添加分类...'
                    className="loading"
                >
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>商品管理</Breadcrumb.Item>
                        <Breadcrumb.Item>添加商品</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="container">
                    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 8 }}>
                        <Form.Item label="商品分类">
                            {
                                getFieldDecorator('category', {
                                rules: [
                                    { 
                                        required: true, message: '请输入需要添加的商品!' 
                                        }
                                    ],
                                    initialValue:category//initialValue是form的方法，设置表单一个初始值
                                })(
                                    <Select
                                        placeholder="请输入需要添加的商品"
                                        onChange={this.handleSelectChange}
                                        >
                                        <Option value="0">根分类</Option>
                                        {
                                            categories.map((categories)=>{
                                                return  <Option 
                                                            key={categories.get('_id')} 
                                                            value={categories.get('_id')}
                                                            >
                                                            {categories.get('name')}
                                                        </Option>
                                                })
                                            }
                                    </Select>
                                )
                            }
                        </Form.Item>

                        <Form.Item label="商品名称">
                            {
                                getFieldDecorator('name', {
                                rules: [
                                    { 
                                        required: true, message: '请输入商品名称!' ,
                                        }
                                    ],
                                    initialValue:name
                                }
                            )(<Input 
                                placeholder={'请输入商品名称'}
                                autoComplete="off"
                                />)
                            }
                        </Form.Item>

                        <Form.Item label="商品描述">
                            {
                                getFieldDecorator('description', {
                                rules: [
                                    { 
                                        required: true, message: '请输入商品描述!' ,
                                        }
                                    ],
                                    initialValue:description
                                }
                            )(<Input 
                                placeholder="请输入商品描述" 
                                autoComplete="off"
                                />)
                            }
                        </Form.Item>

                        <Form.Item label="商品库存">
                            {
                                getFieldDecorator('stock', {
                                rules: [
                                    { 
                                        required: true, message: '请输入商品库存!' ,
                                        }
                                    ],
                                    initialValue:stock
                                }
                            )(<Input
                                placeholder="商品价格" 
                                autoComplete="off"
                                />)
                            }
                        </Form.Item>

                        <Form.Item label="价格(元)">
                            {
                                getFieldDecorator('price', {
                                rules: [
                                    { 
                                        required: true, message: '请输入商品价格!' ,
                                        }
                                    ],
                                    initialValue:price
                                }
                            )(<InputNumber 
                                placeholder="商品价格" 
                                autoComplete="off"
                                min={0}
                                />)
                            }
                        </Form.Item>

                        <Form.Item label="封面图片" 
                        required={true}
                        validateStatus={validateStatus}
                        help={help}
                        >
                            <UploadImage max={1} 
                                fileList={mainImageFileList}
                                action={UPLOAD_PRODUCT_IMAGE} 
                                getFileList={
                                    (getFileList)=>{
                                        handleMainImage(getFileList)
                                    }
                                }
                            />
                        </Form.Item>

                        <Form.Item label="商品图片" 
                        required={true}
                        validateStatus={validateStatus1}
                        help={help1}                        
                        >
                            <UploadImage max={8} 
                                fileList={imagesFileList}
                                action={UPLOAD_PRODUCT_IMAGE} 
                                getFileList={
                                    (getFileList)=>{
                                        handleImages(getFileList)
                                    }
                                }
                            />
                        </Form.Item>

                        <Form.Item label="商品详情">
                            <RichEditor 
                                url={UPLOAD_PRODUCT_DATAILIMAGES}
                                getValue={
                                    (value)=>{
                                        handleDetail(value)
                                    }
                                }
                                values={detail}//商品详情回填传值到富文本
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 12, offset: 5 }} required={true}>
                            <Button 
                                type="primary" 
                                shape="round"
                                onClick={this.handleSubmit}
                            >
                            添加商品
                            </Button>
                        </Form.Item>
                    </Form>
                    </div>
                </Spin>
            </Layout>
        )
    }
}


const WrappedProductSave = Form.create({ name: 'coordinated' })(ProductSave);

//映射属性到组件
const mapStateToProps = (state) => ({
    categories:state.get('product').get('categories'),
    isFetching:state.get('product').get('isFetching'),
    validateStatus:state.get('product').get('validateStatus'),
    help:state.get('product').get('help'),
    validateStatus1:state.get('product').get('validateStatus1'),
    help1:state.get('product').get('help1'),  
    category:state.get('product').get('category'),
    name:state.get('product').get('name'),
    description:state.get('product').get('description'),
    price:state.get('product').get('price'),
    stock:state.get('product').get('stock'),
    detail:state.get('product').get('detail'),
    mainImage:state.get('product').get('mainImage'),
    images:state.get('product').get('images')
})

//映射方法到组件
const mapDispatchToProps = (dispatch) => ({
    handleSave:(err,values)=>{
        dispatch(actionCreator.productSaveAction(err,values));
    },
    handleMainImage:(getFileList)=>{
        dispatch(actionCreator.setMainImageAction(getFileList));
    },
    handleImages:(getFileList)=>{
        dispatch(actionCreator.setImagesAction(getFileList));
    },
    handleDetail:(values)=>{
        dispatch(actionCreator.setDetailAction(values));
    },            
    handleLevelCategories:(level)=>{
        dispatch(actionCreator.getLevelCategories(level))
    },
    getProductDetail:(productId)=>{
        dispatch(actionCreator.getProductDetailAction(productId))
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(WrappedProductSave);