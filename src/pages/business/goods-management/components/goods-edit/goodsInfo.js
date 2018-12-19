import React from 'react';
import {
  Form,
  Input,
  Row,
  Select,
  Col,
  Radio,
  Cascader,
} from 'antd';
import { connect } from 'dva';

import Upload from './upload';
import GroupingForm from './grouping';
import styles from '../../goods-edit/index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class GoodsInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      confirmLoading: false,
      fileList: [],
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.refresh();
    dispatch({ // 查询商品类目
      type: 'goodsEditModel/queryAllInfos',
      payload: {
        pageSize: 10000,
        pageNow: 0,
      },
    });
  }

  componentWillReceiveProps() {
    const { formData } = this.props
    if (formData && formData.uploadFileList) {
      this.setState({
        fileList: formData.uploadFileList
      })
    }
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  // 刷新
  refresh = () => {
    const { dispatch, goodsEditModel } = this.props;
    const { shopId } = goodsEditModel;
    dispatch({
      type: 'goodsEditModel/grouping',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        shopId: shopId,
        name: '',
        createTime: '',
        endTime: '',
      },
    });
  }

  // 新增分组
  addGrouping = () => {
    this.setState({
      visible: true,
    });
  }

  // 确认操作
  handleOk = (value) => {
    console.log(value)
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  // 取消操作
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  // 删除全部图片

  onDelImg = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsEditModel/setSepList',
      payload: {
        fileList: [],
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formData } = this.props;
    const { goodsGrouping, goodsCategory } = this.props.goodsEditModel;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 }
    }
    // 商品类目格式转换
    if (formData.categorys) {
      let categorys = formData.categorys.split(',')
      let categoryId = []
      for (let i = 0; i < categorys.length; i++) {
        categoryId.push(Number(categorys[i]))
      }
      formData.categoryId = categoryId
    }
    return (
      <div className={styles.info_edit}>
        <div className={styles.goods_title}>
          <label>基本信息</label>
        </div>
        <Row>
          <FormItem style={{display: 'none'}}>
            {getFieldDecorator('status', {
              initialValue: formData.status || 0,
            })(
              <Input placeholder="请输入1-35个字" />
            )}
          </FormItem>
          <Col span={12}>
            <FormItem {...formItemLayout} label="商品名称">
              {getFieldDecorator('goodsName', {
                initialValue: formData.goodsName || '',
                rules: [
                  { required: true, message: '请输入内容' },
                  { max: 35, message: '输入字数不能超过35个字' },
                ],
              })(
                <Input placeholder="请输入1-35个字" style={{textOverflow: 'ellipsis'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem wrapperCol={{ span: 13 }} labelCol={{ span: 4 }} label="商品别名">
              {getFieldDecorator('anotherName', {
                initialValue: formData.another || "",
                rules: [
                  { max: 35, message: '输入字数不能超过35个字' },
                ],
              })(
                <Input placeholder="请输入1-35个字" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="商品类目">
              {getFieldDecorator('categoryId', {
                initialValue: formData.categoryId || [],
                rules: [
                  { required: true, message: '请选择商品类目!' },
                ],
              })(
                <Cascader options={goodsCategory} placeholder="请选择商品类目" />
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem wrapperCol={{ span: 13 }} labelCol={{ span: 4 }} label="商品分组">
              {getFieldDecorator('groupId', {
                initialValue: formData.groupId || '',
                rules: [
                  { required: true, message: '请选择商品分组!' },
                ],
              })(
                <Select placeholder="请选择商品分组">
                  {goodsGrouping && goodsGrouping.list && goodsGrouping.list.length !== 0 ?
                    goodsGrouping.list.map((item, index) => {
                      return <Option value={item.groupId} key={index}>{item.name}</Option>
                    })
                    : null
                  }
                </Select>
              )}
            </FormItem>
            <div className={styles.product_grouping}>
              <a href="javascript:;" onClick={() => this.refresh()}>刷新</a>
              <span className={styles.vertical_bar}>|</span>
              <a href="javascript:;" onClick={() => this.addGrouping()}>新增分组</a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="商品类型"
            >
              {getFieldDecorator('goodstype', {
                initialValue: formData.goodsType || 1,
                rules: [
                  { required: true, message: '请选择商品类型!' },
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>实物商品</Radio>
                  <Radio value={2}>虚拟商品</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ height: '30px' }}>
          <Col span={12}>
            <Col span={7} style={{ textAlign: 'right' }}>商品图片：</Col>
          </Col>
          <Col span={10} style={{ textAlign: 'right' }} pull={1}>
            <a href="javascript:;" onClick={this.onDelImg}>删除全部图片</a>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
          </Col>
          <Col span={21}>
            <Upload />
            {/* {this.state.fileList == 0 ? <div className={styles.upload_err}>请上传图片</div> : null} */}
          </Col>
        </Row>
        <div className={styles.upload_info}>
          推荐尺寸：750*750像素，您可以拖拽图片跳转顺序，最多上传9张
        </div>
        <GroupingForm
          visible={this.state.visible}
          handleCancel={this.handleCancel}
          handleOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

export default connect(mapStateToProps)(GoodsInfo)