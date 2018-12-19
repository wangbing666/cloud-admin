import React from 'react';
import {
  Form,
  Input,
  Row,
  Select,
  Col,
  Radio,
  Upload,
  Checkbox,
  Modal,
  Icon
} from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { uploadQiniu } from "utils";

import styles from '../../goods-edit/index.less';

class Grouping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorContent: '',
      imageUrl: '//www',
      showOne: true,
      showTwo: true,
      showThree: true,
      bannerList: [{
        isOutreach: 0, // 0 
        fileId: '',
        goodsId: '',
        outtreachUrl: '',
        hostUrl: '',
        fileUrl: '',
      }, {
        isOutreach: 0,
        fileId: '',
        goodsId: '',
        outtreachUrl: '',
        hostUrl: '',
        fileUrl: '',
      }, {
        isOutreach: 0,
        fileId: '',
        goodsId: '',
        outtreachUrl: '',
        hostUrl: '',
        fileUrl: '',
      }],
    };
  }

  // 确认操作
  handleOk() {
    const { dispatch, goodsEditModel } = this.props;
    const { shopId, userId } = goodsEditModel;
    const { bannerList } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'goodsEditModel/addgrouping',
          payload: {
            ...values,
            shopId: shopId,
            userId: userId,
            type: 1,
            groupId: '',
            bannerList: JSON.stringify(bannerList)
          },
        })
          .then((res) => {
            this.props.handleCancel()
          })
      }
    });
  }

  // 取消操作
  handleCancel() {
    this.props.handleCancel()
  }

  // 设置第一个商品外链
  onChange(e, index) {
    const checked = e.target.checked
    const { bannerList } = this.state;
    if (checked) {
      bannerList[index].isOutreach = 1;
      this.setState({
        bannerList
      })
    } else {
      bannerList[index].isOutreach = 0;
      this.setState({
        bannerList
      })
    }
  }

  // 上传图片
  beforeUpload = (info, index) => {
    const { bannerList } = this.state;
    const myForm = new FormData();
    myForm.append('file', info);
    uploadQiniu(myForm, {
      width: 200,
      height: 200,
      originHeight: 200,
      originWidth: 200,
    }).then((res) => {
      if (res && res.length > 0) {
        bannerList[index].fileId = res[0].fileId;
        bannerList[index].hostUrl = res[0].hostUrl;
        bannerList[index].fileUrl = res[0].fileUrl;
        this.setState({
          bannerList
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, confirmLoading } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const { bannerList } = this.state;
    return (
      <Modal
        title="修改分组"
        width={700}
        visible={visible}
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        confirmLoading={confirmLoading}
      >
        <Row>
          <Form>
            <FormItem label="分组名称：" {...formItemLayout}>
              <Row>
                <Col span={18}>
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '请输入内容' },
                      { max: 10, message: '输入字数不能超过10个字符' },
                    ],
                  })(
                    <Input />
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem label="分组别名：" {...formItemLayout}>
              <Row>
                <Col span={18}>
                  {getFieldDecorator('anotherName', {
                    initialValue: "",
                    rules: [
                      { max: 100, message: '输入字数不能超过100个字符' },
                    ],
                  })(
                    <Input />
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Banner图集：" {...formItemLayout}>
              {bannerList.map((item, index) => {
                return (
                  <Row key={index}>
                    <Col span={6}>
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className=""
                        showUploadList={false}
                        beforeUpload={(e) => this.beforeUpload(e, index)}
                      >
                        {item.hostUrl && item.fileUrl ? <img src={item.hostUrl + item.fileUrl} alt="avatar" style={{ width: 86, height: 86 }} /> : <Icon type='plus' />}
                      </Upload>
                    </Col>
                    <Col span={12}>
                      {item.isOutreach == 0 ?
                        <Select placeholder="请选择一个商品">
                          <Option value="china"></Option>
                        </Select>
                        :
                        <Input />}
                      <p style={{ fontSize: '12px' }}>*不填写链接或不选择商品则不显示该Banner</p>
                    </Col>
                    <Col offset={1} span={4}>
                      <Checkbox onChange={(e) => this.onChange(e, index)}>作为外链</Checkbox>
                    </Col>
                  </Row>
                )
              })}
            </FormItem>
          </Form>
        </Row>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

const GroupingForm = Form.create()(Grouping);

export default connect(mapStateToProps)(GroupingForm)
