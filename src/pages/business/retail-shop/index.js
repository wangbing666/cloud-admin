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
  title: '店铺名称',
  dataIndex: 'shopName',
  key: 'shopName',
  align: 'center',
}, {
  title: '上架商品数',
  dataIndex: 'upgoodsNum',
  key: 'upgoodsNum',
  align: 'center',
}, {
  title: '代理本店商品数',
  dataIndex: 'proxyGoodsNum',
  key: 'proxyGoodsNum',
  align: 'center',
}, {
  title: '代理模式',
  dataIndex: 'proxyMode',
  key: 'proxyMode',
  align: 'center',
  render: (text, row, index) => {
    if (text == 1) {
      return '专卖'
    }
    if (text == 2) {
      return '混合'
    }
  },
}, {
  title: '开店时间',
  dataIndex: 'createTime',
  key: 'createTime',
  align: 'center',
}, {
  title: '店铺状态',
  dataIndex: 'isFrozen',
  key: 'isFrozen',
  align: 'center',
  render: (text, row, index) => {
    if (text == 1) {
      return '正常'
    }
    if (text == 2) {
      return '关闭'
    }
  },
}];

class RetailShop extends React.Component {
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
            {text == 1 ? <a href="javascript:;" style={{ paddingRight: '24px' }} onClick={() => this.onBanDistribution(record)}>
              恢复分销
            </a> : null}
            {text == 2 ? <a href="javascript:;" style={{ paddingRight: '24px' }} onClick={() => this.onBanDistribution(record)}>
              禁止分销
            </a> : null}
            <a href="javascript:;" onClick={() => this.onDialogue(record)}>
              对话分销商
            </a>
          </div>
        );
      }
    })
  }

  state = {
    visible1: false,
    qrCode: false,
    text: '',
    content: '',
    status: '', // 禁止分销或恢复分销状态
    confirmLoading: false,
  }

  componentDidMount() {
    this.initList()
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'retailShopModel/setSearchData',
      payload: {
        searchData: {
          shopName: "", // 店铺名称
          isForbidSale: '', // 商家操作 1恢复分销 2禁止分销
          proxyMode: '', // 代理模式 1 专营 2 混合
          isFrozen: '', // 店铺状态 1 正常 2 关闭
        },
      }
    });
  }

  // 初始化页面
  initList = () => {
    const { dispatch, retailShopModel } = this.props;
    dispatch({
      type: 'retailShopModel/searchListData',
      payload: {
        ...retailShopModel.searchData,
        shopId: retailShopModel.shopId,
        pageNow: retailShopModel.pageNow,
        pageSize: retailShopModel.pageSize,
      }
    });
  }

  // 查询列表
  getSearchData = (e) => {
    const { dispatch, retailShopModel } = this.props;
    e.preventDefault();
    this.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({ type: 'retailShopModel/setPageNow', payload: { pageNow: 1 } });
      dispatch({ type: 'retailShopModel/setSearchData', payload: { searchData: fieldsValue } });
      dispatch({
        type: 'retailShopModel/searchListData',
        payload: {
          ...fieldsValue,
          shopId: retailShopModel.shopId,
          pageNow: 1,
          pageSize: retailShopModel.pageSize,
        }
      });
    });
  }

  //设置PageSize
  setShowSizeChange = (current, pageSize) => {
    const { dispatch, retailShopModel } = this.props;
    dispatch({ type: 'retailShopModel/setPageShowSize', payload: { pageSize } });
    dispatch({ type: 'retailShopModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({
      type: 'retailShopModel/searchListData',
      payload: {
        ...retailShopModel.searchData,
        pageNow: 1,
        pageSize,
        shopId: retailShopModel.shopId,
      }
    });
  };

  //设置PageNow
  setNewPageNow = (pageNow, pageSize) => {
    const { dispatch, retailShopModel } = this.props;
    dispatch({ type: 'retailShopModel/setPageNow', payload: { pageNow } });
    dispatch({
      type: 'retailShopModel/searchListData',
      payload: {
        ...retailShopModel.searchData,
        pageNow,
        shopId: retailShopModel.shopId,
        pageSize: retailShopModel.pageSize
      }
    });
  };

  // 打开禁止分销弹框
  onBanDistribution = (value) => {
    if (value.forbidenStatus == 2) {
      this.setState({
        text: '确认要撤下分销商代理权限',
        content: '撤下后，分销商将下架所有商品并不可上架',
        visible: true,
        status: 1,
        branchShopId: value.branchShopId
      });
    }
    if (value.forbidenStatus == 1) {
      this.setState({
        text: '确认要恢复分销商代理权限',
        content: '恢复后，分销商将可代理或上架云仓商品',
        visible: true,
        status: 2,
        branchShopId: value.branchShopId
      });
    }
  }

  // 对话分销商弹框
  onDialogue = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'retailShopModel/getQrCode',
      payload: {
        codetype: 1,
        type: 1,
        userId: authorization.getUserInfo().userId,
        uuid: value.branchUserId,
      }
    });
    this.setState({
      qrCode: true,
    });
  }

  // 确定按钮
  handleOk = (e) => {
    const { dispatch, retailShopModel } = this.props;
    const { status, branchShopId } = this.state;
    this.setState({
      confirmLoading: true,
    })
    dispatch({
      type: 'retailShopModel/OperateBranchSale',
      payload: {
        shopId: retailShopModel.shopId,
        branchShopId: branchShopId,
        operType: status,
      },
    })
      .then(() => {
        this.setState({
          confirmLoading: false,
          visible: false,
        })
        this.initList();
      })
  }

  // 取消按钮
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  // 关闭二维码弹框
  handleCodeCancel = (e) => {
    console.log(e);
    this.setState({
      qrCode: false,
    });
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
    const { retailShop, pageSize, pageNow, total, searchData, qrCode, showListLoadding, shopId } = this.props.retailShopModel
    const { text, content, confirmLoading } = this.state;
    return (
      <div className={styles.retail_shop}>
        <div className={styles.cloudHead}>
          <div className={styles.cloudHeadLeft}>
            <span>分销店搜索</span>
          </div>
          <div 
            className={styles.cloudHeadRight}
            onMouseEnter={() => this.setState({ qrcodeShop: true })}
            onMouseLeave={() => this.setState({ qrcodeShop: false })}
          >
            <Button type="primary" >查看云仓店</Button>
            {this.state.qrcodeShop ?
              <div className={styles.qrcode_shop}>
                <div className="ant-modal-header">
                  <div className="ant-modal-title">分享云仓店铺</div>
                </div>
                <div className="ant-modal-body">
                  <p>云仓店地址：{`${config.LINK_URL}/cloud-market-h5/shop/home/${shopId}`}</p>
                  <div className={styles.qrcode} ref="qrcode">
                    <h4>手机扫码访问：</h4>
                    <QRCode className="QRCodeBody" bgColor="#ffffff" size={240} value={`${config.LINK_URL}/cloud-market-h5/shop/home/${shopId}`} />
                  </div>
                  <div className={styles.downloadQR}>
                    <a href="javascript:;" onClick={this.downloadQR}>下载二维码</a>
                  </div>
                </div>
              </div>
              : null
            }
          </div>
        </div>
        <RetailShopSearchForm ref={(form) => this.form = form}
          getSearchData={(e) => this.getSearchData(e)}
          searchData={searchData} />
        <div className={styles.retail_shop_title}>
          <h3>分销店列表</h3>
          <Spin size="large" spinning={showListLoadding}>
            <Table columns={this.tableColumn}
              dataSource={retailShop}
              pagination={false}
              rowKey={(r, i) => i} />
            {retailShop.length > 0 ?
              <Pagination showSizeChanger current={pageNow}
                onShowSizeChange={this.setShowSizeChange}
                onChange={this.setNewPageNow} total={total}
                className={styles.pagination} showQuickJumper />
              : <div className="bottomDiv"></div>}
          </Spin>
        </div>
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <h4 style={{ textAlign: 'center' }}>{text}</h4>
          <p>{content}</p>
        </Modal>
        <Modal
          title="分销商二维码"
          className={styles.qrcode_modal}
          visible={this.state.qrCode}
          onCancel={this.handleCodeCancel}
          footer={null}
        >
          <p>可使用：微度APP扫一扫，点击对话，即可沟通</p>
          <div className={styles.qrcode}>
            <h4>手机扫码访问：</h4>
            {qrCode ? <QRCode className="QRCodeBody" bgColor="#ffffff" size={240} value={qrCode} /> : null}
          </div>
        </Modal>
      </div>
    )
  }
}

//搜索条件部分
const RetailShopSearchForm = Form.create()(
  (props) => {
    const { form, searchData, getSearchData } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 14 }
    }
    return (
      <div className={styles.formContent}>
        <Form onSubmit={getSearchData}>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="店铺名称">
                {getFieldDecorator('shopName', { initialValue: searchData.shopName })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...formItemLayout} label="商家操作">
                {getFieldDecorator('isForbidSale', { initialValue: searchData.isForbidSale })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value={1}>恢复分销</Option>
                    <Option value={2}>禁止分销</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="代理模式">
                {getFieldDecorator('proxyMode', { initialValue: searchData.proxyMode })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value={1}>专营</Option>
                    <Option value={2}>混合</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...formItemLayout} label="店铺状态">
                {getFieldDecorator('isFrozen', { initialValue: searchData.isFrozen })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value={1}>正常</Option>
                    <Option value={2}>关闭</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <Button style={{ marginLeft: 40, marginTop: 5 }} type="primary" htmlType="submit">搜索</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
)

const mapStateToProps = (state) => {
  return { retailShopModel: state.retailShopModel }
}

export default connect(mapStateToProps)(RetailShop)

