import React, { Component } from 'react';
import { connect } from 'dva';
import BlockHead from '../components/blockHead/index';
import router from 'umi/router';
import { Form, Input, Row, Col, Upload, message, Button } from 'antd';
import styles from './index.less';
import { insertOrUpdateShop } from '../api/index';
import { authorization, checkImgType, uploadQiniu } from 'utils';

const FormItem = Form.Item;
const { TextArea } = Input; 

const BaseForm = Form.create()(
  class CreateForm extends Component {

    constructor(props) {
      super(props);
      this.state = {
        loading: false,
      }
    }

    async beforeUpload(file) {
      const isJPG = checkImgType(file.type);
      if (!isJPG) {
        message.error('请上传jpg,jpeg,png,gif,bmp格式图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片过大!');
      }
      // return isJPG && isLt2M;
      const { changeBgImg } = this.props;
      if (isJPG && isLt2M){
        const formData = new FormData()
        formData.append('file', file, 'file')
        const resultData = await uploadQiniu(formData, {
          width: 100,
          height: 100,
          originHeight: 150,
          originWidth: 150,
        })
        if (resultData) {
          changeBgImg(resultData)
        }
      }
      return false
    }
    
    render() {
      const { form, baseInfo, validatorShopName, validatorLogo, validatorName } = this.props;
      const { fileUrl, hostUrl } = baseInfo
      const { getFieldDecorator } = form; 
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 12 }
      }

      const imageUrl = hostUrl + fileUrl;
      
      return (
        <div className={styles.content}>
        <Row type="flex" justify="center">
        <Col span={12}>
          <Form>
            <FormItem label="店铺名字" {...formItemLayout}>
              {getFieldDecorator('shopName', {
                initialValue: baseInfo.shopName,
                rules: [{ required: true, message: '请输入名字' }, {
                  validator: validatorShopName,
                }, {
                  validator: validatorName,
                }],
              })(
                <Input maxLength={30} />
              )}
            </FormItem>
            <FormItem label="店铺Logo" {...formItemLayout}>
            {
              getFieldDecorator('logo',{
                initialValue: [1],
                rules: [{ required: true, message: ' '}, {
                  validator: validatorLogo
                }]
              })(
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={styles.avatarUploader}
                  showUploadList={false}
                  beforeUpload={this.beforeUpload.bind(this)}
                  >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 100, height: 100 }} /> : <Button size="small">上传</Button>}
                </Upload>
              )
            }
            <p>推荐尺寸100px*100px</p>
            </FormItem>
            <FormItem label='店铺简介' {...formItemLayout}>
              {getFieldDecorator('shopIntrod', {
                initialValue: baseInfo.shopIntrod,
              })(
                <TextArea maxLength="100" />
              )}
            </FormItem>
          </Form>
        </Col>
        </Row>
        </div>
      )
    }
  }
)

class EditBaseInfo extends Component {

  goBack() {
    router.goBack()
  } 

  _submit = () => {
    this.formRef.validateFields((err, value) => {
      if (err) {
        return;
      } else {
        const userInfo = authorization.getUserInfo();
        const { shopModel } = this.props;
        const { baseInfo } = shopModel;
        const orderData = {
          enterpriseId: userInfo.enterpriseId,
          shopId: userInfo.shopId,
          describes: value.shopIntrod,
          logoId: baseInfo.fileId,
          shopName: value.shopName
        }
        insertOrUpdateShop(orderData).then((res) => {
          if (res.status === 0){
            message.success('提交成功')
            router.goBack()
          } else {
            message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    })
  } 

  componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    dispatch({type: 'shopModel/getShopInfo', payload: {shopId: userInfo.shopId} })
  }

  changeBgImg(res){
    const data = res[0]
    const { dispatch, shopModel } = this.props;
    const { baseInfo } = shopModel;
    baseInfo.fileUrl = data.fileUrl
    baseInfo.hostUrl = data.hostUrl
    baseInfo.fileId = data.fileId
    dispatch({type: 'shopModel/saveShopBaseInfo', payload: {...baseInfo}})
  }

  validatorShopName(rules, value, callback) {
    if (value && value.length === 1) {
      callback('请输入2~30');
    } else {
      callback();
    }
  }

  validatorName(rules, value, callback) {
    if (!value || /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
      callback();
    } else {
      callback('禁止输入特殊字符');
    }
  }

  validatorLogo(rules, value, callback) {
    const { shopModel } = this.props;
    const { baseInfo } = shopModel;
    if (!baseInfo.fileId){
      callback('请上传LOGO')
    } else {
      callback();
    }
  }
  

  render() {
    const { shopModel } = this.props;
    const { baseInfo, qnVoucher } = shopModel;
    return (
      <div className={styles.container}>
        <BlockHead leftText="编辑基本信息" goBackBt={this.goBack} savetBt={{event: this._submit, text: '保存'}} />
        <BaseForm 
          baseInfo={baseInfo} 
          qnVoucher={qnVoucher}
          changeBgImg={this.changeBgImg.bind(this)}
          validatorShopName={this.validatorShopName.bind(this)}
          validatorLogo={this.validatorLogo.bind(this)}
          validatorName={this.validatorName.bind(this)}
          ref={(form) => this.formRef = form} 
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { shopModel: state.shopModel }
}

export default connect(mapStateToProps)(EditBaseInfo);
