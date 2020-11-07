import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select,Breadcrumb,Spin,InputNumber } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const { Option } = Select;
import UploadImage from 'common/upload-image';
import { actionCreator } from './store';
import Layout from 'common/layout';
import { UPLOAD_PRODUCT_IMAGE } from 'api/config.js';

class CategoryAdd extends Component {
    constructor(props){
        super(...props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)

    }
    componentDidMount(){
        this.props.handleLevelCategories()//不传参后台默认level=2
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.handleAddCategory(values);
          }
        });
      };
    handleSelectChange (value) {
        this.props.form.setFieldsValue({
        });
    };

    render(){
        const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
        const { getFieldDecorator } = this.props.form;
        const { isFetching,categories } = this.props

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
                        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                        <Breadcrumb.Item>添加分类</Breadcrumb.Item>
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
                                }
                            )(<Input 
                                placeholder="请输入商品名称" 
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
                                }
                            )(<Input
                                placeholder="商品价格" 
                                autoComplete="off"
                                />)
                            }
                        </Form.Item>

                        <Form.Item label="商品价格">
                            {
                                getFieldDecorator('price', {
                                rules: [
                                    { 
                                        required: true, message: '请输入商品价格!' ,
                                        }
                                    ],
                                }
                            )(<InputNumber 
                                placeholder="商品价格" 
                                autoComplete="off"
                                />)
                            }
                        </Form.Item>

                        <Form.Item label="封面图片">
                            <UploadImage max={1} action={UPLOAD_PRODUCT_IMAGE} />
                        </Form.Item>

                        <Form.Item label="商品图片">
                            <UploadImage max={8} action={UPLOAD_PRODUCT_IMAGE}/>
                        </Form.Item>

                        <Form.Item label="商品详情">
                            <UploadImage max={1}/>
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                            <Button 
                                type="primary" 
                                shape="round"
                                onClick={this.handleSubmit}
                            >
                            添加分类
                            </Button>
                        </Form.Item>
                    </Form>
                    </div>
                </Spin>
            </Layout>
        )
    }
}


const WrappedCategoryAdd = Form.create({ name: 'coordinated' })(CategoryAdd);

//映射属性到组件
const mapStateToProps = (state) => ({
    isFetching:state.get('category').get('isFetching'),
    categories:state.get('category').get('categories')

})
//映射方法到组件
const mapDispatchToProps = (dispatch) => ({
    handleAddCategory:(values)=>{
        dispatch(actionCreator.getAddAction(values));
    },
    handleLevelCategories:(level)=>{
        dispatch(actionCreator.getLevelCategories(level))
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(WrappedCategoryAdd);