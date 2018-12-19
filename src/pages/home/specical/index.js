/*eslint eqeqeq:0*/
import React from 'react';
import { connect } from 'dva'

import { Table, Button, Pagination, Spin, Form, Input, Select, Row, Col, Modal } from 'antd';
const QRCode = require('qrcode.react');
import { authorization, config } from 'utils';

import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;


const columns = [{
  title: '账户类型',
  dataIndex: 'accountType',
  key: 'accountType',
  align: 'center',
  render: (text) => {
    if (text == 0) {
      return '推荐人'
    }
  }
}, {
  title: '交易类型',
  dataIndex: 'transType',
  key: 'transType',
  align: 'center',
  render: (text) => {
    if (text == 0) {
      return '入金'
    }
  }
}, {
  title: '收费方式',
  dataIndex: 'rateType',
  key: 'rateType',
  align: 'center',
  render: (text) => {
    if (text == 0) {
      return '比例'
    }
  }
}, {
  title: '比例（%）',
  dataIndex: 'proportionRate',
  key: 'proportionRate',
  align: 'center',
}];

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, data } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="修改费率"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem style={{ display: 'none' }} label="比例（%）" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('id', {
                initialValue: data && data.id ? data.id : '',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="交易类型" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('title', { initialValue: data ? data.transType : 0 })(
                <Select disabled>
                  <Option value={0}>入金</Option>
                  <Option value={1}>出金</Option>
                  <Option value={2}>账户间流转</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="收费方式" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('description', { initialValue: data ? data.rateType : 0 })(
                <Select disabled>
                  <Option value={0}>比例</Option>
                  <Option value={1}>固定</Option>
                  <Option value={2}>请选择</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="比例（%）" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('proportionRate', {
                initialValue: data && data.proportionRate ? data.proportionRate : 70,
                rules: [{ required: true, message: '请输入内容' }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

class Specical extends React.Component {
  constructor(props) {
    super(props);
    this.tableColumn = columns.concat({
      title: '操作',
      dataIndex: 'forbidenStatus',
      key: 'forbidenStatus',
      width: '200px',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <a href="javascript:;" style={{ paddingRight: '24px' }} onClick={() => this.onChangeRate(record)}>
              编辑
            </a>
            <a href="javascript:;" onClick={() => this.onDialogue(record)}>
              邀请好友
            </a>
          </div>
        );
      }
    })
  }

  state = {
    visible: false,
    qrCode: '',
  }

  componentDidMount() {
    this.initList()
  }

  // 初始化页面
  initList = () => {
    const { dispatch, homeModel } = this.props;
    dispatch({
      type: 'homeModel/TxShopRate',
      payload: {
        shopId: homeModel.shopId,
      }
    });
  }

  // 修改费率弹框
  onChangeRate = (value) => {
    this.setState({
      visible: true,
      value: value,
    });
  }

  // 对话分销商弹框
  onDialogue = (value) => {
    this.setState({
      qrCodeModal: true,
      qrCode: config.LINK_URL + '/multiShop/tsboLogin?superiorAgent=' + value.shopId + '&referee=0',
    });
  }

  // 取消按钮
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  // 关闭二维码弹框
  handleCodeCancel = (e) => {
    this.setState({
      qrCodeModal: false,
    });
  }

  // 导出excel
  onSpecicalExport = () => {
    const { dispatch, homeModel } = this.props;
    dispatch({
      type: 'homeModel/specicalExport',
      payload: {
        shopId: homeModel.shopId,
      }
    });
  }

  // 保存推荐人费率比例
  handleCreate = () => {
    const { dispatch } = this.props;
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'homeModel/updateShopRate',
        payload: {
          ...values
        }
      }).then(() => {
        this.initList()
      })
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  // 弹框中的form表单
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  // 下载二维码
  downloadQR = () => {
    const canvasImg = this.refs.qrcode.children[1].toDataURL(); // 获取canvas图片dom
    var a = document.createElement("a"); // 创建a标签保存该二维码
    a.href = canvasImg;
    a.download = '二维码';
    a.click();
  }

  render() {
    const { txShopRate, showListLoadding, shopId } = this.props.homeModel
    const { qrCode } = this.state;
    return (
      <div className={styles.specical}>
        <div className={styles.specical_title}>
          <div className={styles.specical_export}>
            <Button type="primary" onClick={this.onSpecicalExport}>导出</Button>
          </div>
          <Spin size="large" spinning={showListLoadding}>
            <Table columns={this.tableColumn}
              dataSource={txShopRate}
              pagination={false}
              rowKey={(r, i) => i} />
          </Spin>
        </div>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          data={this.state.value}
        />
        <Modal
          width={620}
          title="邀请特殊用户"
          className={styles.qrcode_modal}
          visible={this.state.qrCodeModal}
          onCancel={this.handleCodeCancel}
          footer={null}
        >
          <div>
            链接： {`${config.LINK_URL}/multiShop/tsboLogin?superiorAgent=${shopId}&referee=0`}
          </div>
          <div className={styles.qrcode} ref="qrcode">
            <h4>手机扫码访问：</h4>
            {qrCode ? <QRCode id="qrcode" className="QRCodeBody" bgColor="#ffffff" size={240} value={qrCode} /> : null}
          </div>
          <div className={styles.downloadQR}>
            <a href="javascript:;" onClick={this.downloadQR}>下载二维码</a>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { homeModel: state.homeModel }
}

export default connect(mapStateToProps)(Specical)

