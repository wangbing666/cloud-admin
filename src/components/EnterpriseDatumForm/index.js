/**
 * Created by Fanning
 */
import React, { Component } from 'react';
import { Form, Upload, Input, Button, TreeSelect, Select, message, Checkbox, Modal } from 'antd';
import styles from './index.less';
import { getCategoryList, getIndustryList, downloadWord, addWord, upload } from './api/index';
import { uploadQiniu, checkImgType } from "utils";

const SHOW_CHILD = TreeSelect.SHOW_CHILD;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: {
    offset: 1,
    span: 12,
  },
}

const formItemRight = {
  wrapperCol: {
    offset: 8,
    span: 12,
  },
}


const EnterpriseDatum = Form.create()(
  class createForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        categoryList: [], // 经营类目
        industryList: [], // 行业列表
        // info: {
        //   enterpriseName: '', // 企业名称
        //   enterpriseAbbreviation: '', //企业简称
        //   unifiedSocialRegCode: '', // 社会注册代码
        //   contactName: '', // 联系人
        //   contactMobile: '', // 联系手机号
        //   industryId: '', // 所属行业id
        //   businessLicensePicId: 0, // 营业执照-文件-id
        //   businessLicensePicUrl: '', // 营业执照-url
        //   authorizationPicId: 0, // 企业授权书-文件-id
        //   authorizationPicUrl: '', // 企业授权书-url
        //   logoPicId: 0, // logo-文件-id
        //   logoPicUrl: '', // logo-url
        //   shopName: '', // 店铺名称
        //   categoryList: [], // 选择经营类目
        //   shopAbbreviation: '', // 店铺简介
        //   shopCoverPicId: 0, // 封面-id
        //   shopCoverPicUrl: '', // 封面-URL
        // },
        readStatus: true, // 是否阅读文档
        downTemUrl: '', // 模板链接
        previewVisible: false,
        previewImage: '',
      }
    }

    componentDidMount() {
      // 获取经营类目
      getCategoryList().then((data) => {
        if (data && data.status === 0) {
          const list = data.body.categoryList;
          const formList = list.map((item) => {
            const children = item.zi.reduce((_zi, value) => ([..._zi, {
              title: value.categoryName,
              value: value.categoryId,
            }]), [])
            return {
              title: item.fu.categoryName,
              value: item.fu.categoryId,
              children: children,
            }
          })
          this.setState({
            categoryList: formList,
          })
          console.log(this.state.categoryList)
        }
      })
      // 获取行业大类
      getIndustryList().then((res) => {
        if (res && res.status === 0) {
          const list = res.body.list.reduce((_list, item) => ([
            ..._list,
            {
              title: item.categoryName,
              value: item.categoryId,
            }
          ]), []);
          this.setState({
            industryList: list,
          })
        }
      })
      downloadWord().then((res) => {
        if (res && res.status === 0) {
          this.setState({
            downTemUrl: res.data,
          })
        }
      })
    }

    // 上传图片
    async beforeUpload(file) {
      const isJPG = checkImgType(file.type);
      if (!isJPG) {
        message.error('请上传正确格式图片!');
      }
      const isLt5M = file.size / 1024 / 1024 < 1;
      if (!isLt5M) {
        message.error('图片不能超过 1MB!');
      }
      if (isJPG && isLt5M) {
        const formData = new FormData()
        formData.append('file', file, 'file')
        const res = await uploadQiniu(formData, {
          width: 500,
          height: 500,
          originWidth: 200,
          originHeight: 200,
        })
        if (res) {
          this.self.props.changeImg(this.name, res[0])
        }
      }
      return false
    }

    // 上传word文档
    async beforeUploadDocx(file) {
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isDocx) {
        message.error('请上传docx格式文件')
      }
      const fileSize = file.size / 1024 / 1024 < 10;
      if (!fileSize) {
        message.error('文件过大')
      }
      if (isDocx && fileSize) {
        const formData = new FormData()
        formData.append('file', file, 'file')
        const hash = await upload(formData);
        if (hash && hash.Hash) {
          const res = await addWord({ fileUrl: hash.Hash })
          if (res && res.status === 0) {
            this.self.props.changeImg(this.name, res.data)
          }
        }
      }
      return false;
    }

    // 验证图片是否为空
    validatorImg = (rule, value, callback) => {
      const field = rule.field;
      const { entInfo } = this.props;
      if (entInfo[field] === 0 || entInfo[field] == null) {
        switch (field) {
          case 'businessLicensePicId':
            callback('请上传营业执照');
            break;
          case 'authorizationPicId':
            callback('请上传企业授权书');
            break;
          case 'shopCoverPicId':
            callback('请上传店铺封面');
            break;
        }
      }
      callback();
    }

    // 社会统一编码
    validatorUnifiedCode = (rule, value, callback) => {
      if (!value || /^[0-9A-Z]{18}$/.test(value)) {
        callback()
      } else {
        callback('请输入正确格式的注册代码');
      }
    }

    // 手机号码验证
    validatorPhoneNum = (rule, value, callback) => {
      if (!value || /^[0-9]{11}$/.test(value)) {
        callback()
      } else {
        callback('请输入正确格式的手机号');
      }
    }

    // 用户手册阅读状态
    changeReadStat = (status) => {
      this.setState({
        readStatus: !status
      })
    }

    // 特殊字符验证
    validatorName = (rule, value, callback) => {
      if (!value || /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
        callback();
      } else {
        callback('禁止输入特殊字符');
      }
    }
    // 店铺名称
    validatorShopName = (rule, value, callback) => {
      if (!value || /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
        if (value.length === 1) {
          callback('请输入2~30个字');
        }
        callback();
      } else {
        callback('禁止输入特殊字符');
      }
    }

    // 预览
    previewImg = (url) => {
      this.setState({
        previewVisible: true,
        previewImage: url,
      })
    }

    handleCancel = () => {
      this.setState({
        previewVisible: false,
      })
    }

    _submit = (type) => {
      const { categoryList } = this.state;
      this.props.form.validateFields((err, value) => {
        if (err) {
          message.error('请完善信息')
        } else {
          const { readStatus } = this.state;
          if (readStatus) {
            const orderData = Object.assign({}, value)
            console.log(orderData)
            const { entInfo, saveInfo } = this.props;
            orderData.businessLicensePicId = entInfo.businessLicensePicId;
            orderData.authorizationPicId = entInfo.authorizationPicId;
            orderData.logoPicId = entInfo.logoPicId;
            orderData.shopCoverPicId = entInfo.shopCoverPicId;
            orderData['type'] = type;
            saveInfo(orderData)
          } else {
            message.warning('请认真阅读《微度平台服务条款》《电商入驻协议》并同意')
          }
        }
      })
    }

    render() {
      const { form, entInfo, isOnce } = this.props;
      const info = entInfo
      const {
        categoryList,
        industryList,
        readStatus,
        downTemUrl,
        previewVisible,
        previewImage,
      } = this.state;
      const { getFieldDecorator } = form;

      const tProps = {
        treeData: categoryList,
        treeCheckable: true,
        showCheckedStrategy: SHOW_CHILD,
        searchPlaceholder: '请选择类目',
        style: {
          width: 400,
        },
        dropdownStyle: {
          height: 500,
          // boxShadow: '10px 10px 5px #888888'
        }
      };

      return (
        <div className={styles.container}>
          <h3>企业资料</h3>
          <Form>
            <FormItem label="企业名称" {...formItemLayout}>
              {
                getFieldDecorator('enterpriseName', {
                  initialValue: info.enterpriseName,
                  rules: [{
                    required: true,
                    message: '请输入企业名称'
                  }, {
                    validator: this.validatorName,
                  }]
                })(<Input maxlength='20' />)
              }
            </FormItem>
            <FormItem label="企业简称" {...formItemLayout}>
              {
                getFieldDecorator('enterpriseAbbreviation', {
                  initialValue: info.enterpriseAbbreviation,
                  rules: [{
                    required: true,
                    message: '请输入企业简称'
                  }, {
                    validator: this.validatorName,
                  }]
                })(<Input maxlength='10' />)
              }
            </FormItem>
            <FormItem label="统一社会注册代码" {...formItemLayout}>
              {
                getFieldDecorator('unifiedSocialRegCode', {
                  initialValue: info.unifiedSocialRegCode,
                  rules: [{
                    required: true,
                    message: '请输入统一社会注册代码'
                  }, {
                    validator: this.validatorUnifiedCode,
                  }]
                })(<Input disabled={info.unifiedSocialRegCode} />)
              }
            </FormItem>
            <FormItem label="联系人姓名" {...formItemLayout}>
              {
                getFieldDecorator('contactName', {
                  initialValue: info.contactName,
                  rules: [{
                    required: true,
                    message: '请输入姓名'
                  }, {
                    validator: this.validatorName,
                  }]
                })(<Input maxlength='10' />)
              }
            </FormItem>
            <FormItem label="联系手机号" {...formItemLayout}>
              {
                getFieldDecorator('contactMobile', {
                  initialValue: info.contactMobile,
                  rules: [{
                    required: true,
                    message: '请输入联系手机号'
                  }, {
                    validator: this.validatorPhoneNum,
                  }]
                })(<Input />)
              }
            </FormItem>
            <FormItem label="所属行业" {...formItemLayout}>
              {
                getFieldDecorator('industryId', {
                  initialValue: info.industryId,
                })(<Select>
                  {
                    industryList.map((item) => {
                      return <Option value={item.value}>{item.title}</Option>
                    })
                  }
                </Select>)
              }
            </FormItem>
            <FormItem label="上传营业执照" {...formItemLayout}>
              {
                info ?
                  getFieldDecorator('businessLicensePicId', {
                    initialValue: [1],
                    rules: [{
                      required: true,
                      message: ' '
                    }, {
                      validator: this.validatorImg
                    }]
                  })(<Upload
                    name="businessLicensePic"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    self={this}
                  >
                    {info.businessLicensePicUrl ? <img src={info.businessLicensePicUrl} style={{ width: 250, height: 190 }} alt="" /> : <Button size="small">上传</Button>}
                  </Upload>) : null
              }
              {
                info.businessLicensePicUrl ? <Button size="small" onClick={() => this.previewImg(info.businessLicensePicUrl)}>预览</Button> : null
              }
            </FormItem>
            <FormItem label="上传企业授权书" {...formItemLayout}>
              {
                getFieldDecorator('authorizationPicId', {
                  initialValue: [1],
                  rules: [{
                    required: true,
                    message: ' '
                  }, {
                    validator: this.validatorImg
                  }]
                })(<Upload
                  name="authorizationPic"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  self={this}
                >
                  {info.authorizationPicUrl ? <img src={info.authorizationPicUrl} style={{ width: 250, height: 190 }} alt="avatar" /> : <Button size="small">上传</Button>}
                </Upload>)
              }
              {
                info.authorizationPicUrl ? <Button size="small" onClick={() => this.previewImg(info.authorizationPicUrl)}>预览</Button> : null
              }
              <p><a href={downTemUrl}><Button icon="download" size="small">下载模板</Button></a></p>
            </FormItem>
            <FormItem label="上传企业LOGO" {...formItemLayout}>
              {
                <Upload
                  name="logoPic"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  self={this}
                >
                  {info.logoPicUrl ? <img src={info.logoPicUrl} style={{ width: 250, height: 190 }} alt="avatar" /> : <Button size="small">上传</Button>}
                </Upload>
              }
              {
                info.logoPicUrl ? <Button size="small" onClick={() => this.previewImg(info.logoPicUrl)}>预览</Button> : null
              }
            </FormItem>
            <hr style={{ border: '1px solid #e9e9e9' }} />
            <h3>店铺资料</h3>
            <FormItem label="店铺名称" {...formItemLayout}>
              {
                getFieldDecorator('shopName', {
                  initialValue: info.shopName,
                  rules: [{
                    required: true,
                    message: '请填写店铺名称'
                  }, {
                    validator: this.validatorShopName,
                  }]
                })(<Input maxlength='30' />)
              }
            </FormItem>
            <FormItem label="选择经营类目" {...formItemLayout}>
              {
                getFieldDecorator('categoryIdList', {
                  initialValue: info.categoryList,
                  rules: [{
                    required: true,
                    message: '请选择经营类目'
                  }]
                })(
                  <TreeSelect {...tProps} />
                )
              }
            </FormItem>
            <FormItem label="店铺简介" {...formItemLayout}>
              {
                getFieldDecorator('shopAbbreviation', {
                  initialValue: info.shopAbbreviation,
                  rules: [{
                    required: true,
                    message: '请填写店铺简介'
                  }]
                })(<TextArea maxlength='100' />)
              }
            </FormItem>
            <FormItem label="店铺封面" {...formItemLayout}>
              {
                getFieldDecorator('shopCoverPicId', {
                  initialValue: [1],
                  rules: [{
                    required: true,
                    message: ' '
                  }, {
                    validator: this.validatorImg
                  }]
                })(<Upload
                  name="shopCoverPic"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  self={this}
                >
                  {info.shopCoverPicUrl ? <img src={info.shopCoverPicUrl} style={{ width: 250, height: 190 }} alt="" /> : <Button size="small">上传</Button>}
                </Upload>)
              }
              <p>推荐尺寸100px*100px</p>
              {
                info.shopCoverPicUrl ? <Button size="small" onClick={() => this.previewImg(info.shopCoverPicUrl)}>预览</Button> : null
              }
            </FormItem>
            <FormItem {...formItemRight}>
              <Checkbox
                checked={readStatus}
                onChange={() => this.changeReadStat(readStatus)}>我已阅读并同意</Checkbox>
              <a target="view_window_1" href="http://uu.wedo77.com/UU/businessCooperationAgreement.html">《微度平台服务条款》</a>
              <a target="view_window_2" href="http://uu.wedo77.com/UU/businessAgreement.html">《电商入驻协议》</a>
              <a target="view_window_3" href="http://uu.wedo77.com/UU/shareingAgreement.html">《云仓共享协议》</a>
            </FormItem>
            <FormItem {...formItemRight}>
              {isOnce ? <Button onClick={() => this._submit(0)}>保存</Button> : null}
              <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => this._submit(1)}>{isOnce ? '保存并下一步' : '提交'}</Button>
            </FormItem>
          </Form>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      )
    }
  }
)

export default EnterpriseDatum;
