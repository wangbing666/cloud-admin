import React, { Component } from 'react';
import styles from './index.less';
import { Row, Table, Modal, Tabs, Icon, Input, Col, Pagination, message } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { authorization } from 'utils';
import { updateShopContactType } from './api/index';

const TabPane = Tabs.TabPane

const columns = [
  {
    title: '一级目录',
    dataIndex: 'parentCategoryName',
  },
  {
    title: '二级目录',
    dataIndex: 'subCategoryName',
  },
  {
    title: '上架中商品',
    dataIndex: 'onFrameNums',
  },
  {
    title: '未上架商品',
    dataIndex: 'notFrameNums',
  },
  {
    title: '质保限制',
    dataIndex: 'guaranteePeriod',
  },
  {
    title: '无理由退款',
    render: (row) => {
      return (
        <span>{row.mandatoryReturn === 1 ? '是' : '否'}</span>
      )
    }
  }
]


class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogStat: false,
      tabActiveKey: '1',
      mobile: '',
      tel: '',
      zone: '',
    }
  }

  componentDidMount() {
    this.getCategory()
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    dispatch({
      type: 'userInfoModel/queryAccountInfo',
      payload: {
        bussId: userInfo.shopId,
        bussType: 2,
      }
    })
    dispatch({
      type: 'userInfoModel/queryShopContact',
      payload: {shopId: userInfo.shopId}
    })
  }

  // 获取当前类目
  getCategory() {
    const { dispatch, userInfoModel } = this.props;
    const { categoryList } = userInfoModel;
    const { pageNow, pageSize } = categoryList;
    const userInfo = authorization.getUserInfo();
    dispatch({
      type: 'userInfoModel/queryAuditPassCategory', payload: {
        shopId: userInfo.shopId,
        pageNow: pageNow,
        pageSize: pageSize,
      }
    })
  }
  // 打开修改联系diodal model
  openchangePhoneMadal() {
    this.setState({
      dialogStat: true,
    })
  }

  // 修改联系方式
  upContact(params) {
    const { dispatch } = this.props;
    const { tabActiveKey } = this.state;
    const userInfo = authorization.getUserInfo();
    updateShopContactType({
      shopId: userInfo.shopId,
      bindType: parseInt(tabActiveKey),
      phoneNum: params,
    }).then((res) => {
      if (res && res.status === 0) {
        message.success('修改成功！')
        dispatch({
          type: 'userInfoModel/queryShopContact',
          payload: {shopId: userInfo.shopId}
        })
        this.setState({
          dialogStat: false,
        })
      } else {
        message.error('修改失败！')
      }
    })
  }

  // 号码验证
  handleOk() {
    const { tabActiveKey, mobile, tel, zone } = this.state;
    if (tabActiveKey === '1') {
      if (mobile) {
        const re = /^1[345678]\d{9}$/;
        if (re.test(mobile)) {
          this.upContact(mobile);
        } else {
          message.error('请输入正确的手机号码')
        }
      } else {
        message.error('请正确格式手机号')
      }
    } else {
      if (tel && zone) {
        const phoneNum = zone + '-' + tel;
        const re = /(?:(86-?)?(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)/;
        if (re.test(phoneNum)) {
          this.upContact(phoneNum);
        } else {
          message.error('请输入正确的电话号码')
        }
      } else {
        message.error('请输入电话号码')
      }
    }
  }

  handleCancel() {
    this.setState({
      dialogStat: false,
    })
  }

  onChangeModile(res) {
    const { value } = res.target;
    this.setState({
      mobile: value,
    })
  }

  onChangeTel(res) {
    const { value } = res.target;
    this.setState({
      tel: value,
    })
  }

  onChangeZone(res) {
    const { value } = res.target;
    this.setState({
      zone: value,
    })
  }

  changeTab(res) {
    this.setState({
      tabActiveKey: res,
    })
  }

  async changePage(page, pageSize) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'userInfoModel/changePageInfo', payload: {
        pageNow: page,
        pageSize: pageSize,
      }
    })
    this.getCategory()
  }

  async changePageSize(current, size) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'userInfoModel/changePageInfo', payload: {
        pageNow: current,
        pageSize: size,
      }
    })
    this.getCategory()
  }
  render() {
    const { dialogStat, tabActiveKey, mobile, tel, zone } = this.state;
    const { userInfoModel } = this.props;
    const { categoryList, userInfo, contactNum } = userInfoModel;
    return (
      <div className={styles.container}>
        <div className={styles.blockHead}>
          <div className={styles.blockHeadLeft}>
            <span>账号基本信息</span>
          </div>
        </div>
        <div className={styles.content}>
          <Row>
            <p className={styles.pItem}>
              <span className={styles.label}>管理员：</span>
              <span className={styles.info}>{userInfo.userName}</span>
              <Link to="user-info/change-manager" style={{ marginLeft: '10px' }}>更换</Link>
            </p>
            <p className={styles.pItem}>
              <span className={styles.label}>微度手机绑定：</span>
              <span className={styles.info}>{userInfo.mobile}</span>
            </p>
            <p className={styles.pItem}>
              <span className={styles.label}>店铺联系方式：</span>
              <span className={styles.info}>{contactNum}</span>
              <a style={{ marginLeft: '10px' }} onClick={this.openchangePhoneMadal.bind(this)}>修改</a>
            </p>
            <p className={styles.pItem}>
              <span className={styles.label}>经营类目：</span>
              <span className={styles.info}>下表是经审核通过的经营类目，您可通过修改企业与经营信息重新申请类目， <Link to="user-info/enterprise-datum">立即前往</Link></span>
            </p>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Table
              // total={categoryList.total}
              rowKey={record => record.groupId}
              columns={columns}
              dataSource={categoryList.list}
              pagination={false}
            />
          </Row>
          <Row className={styles.pagination}>
            <Pagination
              total={categoryList.total}
              showSizeChanger
              showQuickJumper
              defaultCurrent={categoryList.pageNow}
              defaultPageSize={categoryList.pageSize}
              onChange={this.changePage.bind(this)}
              onShowSizeChange={this.changePageSize.bind(this)}
            />
          </Row>
        </div>
        <Modal
          title="联系方式"
          visible={dialogStat}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Tabs defaultActiveKey={tabActiveKey} onChange={this.changeTab.bind(this)}>
            <TabPane tab={<span><Icon type="phone" />固话</span>} key='2'>
              <Row>
                <Col span={5}>
                  <Input
                    type="text"
                    value={zone}
                    maxLength="4"
                    onKeyUp={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                    onChange={this.onChangeZone.bind(this)}
                  />
                </Col>
                <Col span={14} offset={2}>
                  <Input
                    type="text"
                    value={tel}
                    maxLength="8"
                    onChange={this.onChangeTel.bind(this)}
                    onKeyUp={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={<span><Icon type="mobile" />手机</span>} key='1'>
              <Input
                type="text"
                value={mobile}
                maxLength="11"
                onChange={this.onChangeModile.bind(this)}
                onKeyUp={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { userInfoModel: state.userInfoModel }
}

export default connect(mapStateToProps)(UserInfo);
