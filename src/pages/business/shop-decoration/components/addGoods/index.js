import React, { Component } from 'react';
import { connect } from 'dva';
import BlockHead from '../blockHead/index';
import styles from './index.less';
import { getGoodsByShopId, listShopGroupName } from '../../api/index'
import { Form, Row, Col, Table, Input, Pagination, Spin, Select, message } from 'antd';
import { authorization } from 'utils';

const FormItem = Form.Item;
const Option = Select.Option;

const SearchForm = Form.create()(
  (props) => {
    const { form, groupOptions } = props;
    const { getFieldDecorator } = form; 
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    }
    return (
      <div>
        <Form layout="inline">
          <Row type="flex" align="middle" className={styles.search}>
            <Col span={8} style={{ textAlign: 'center' }}>
              <FormItem label="商品名称" {...formItemLayout}>
                {getFieldDecorator('goodsName', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <FormItem label="商品分组" {...formItemLayout}>
                {
                  getFieldDecorator('groupId', {
                    initialValue: 0,
                  })(
                    <Select style={{width: 150}}>
                      <Option value={0}>全部</Option>
                      {
                        groupOptions.map((value) => {
                          return <Option key={value.groupId} value={value.groupId}>{value.groupName}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <FormItem label="发布状态" {...formItemLayout}>
              {
                getFieldDecorator('status', {
                  initialValue: "",
                })(
                  <Select style={{width: 150}}>
                    <Option value="">全部</Option>
                    <Option value={0}>待上架</Option>
                    <Option value={1}>已上架</Option>
                    <Option value={2}>已下架</Option>
                    <Option value={3}>已售完</Option>
                  </Select>
                )
              }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
)

const columns = [{
    title: '商品图片',
    render: (row) => { return (<img style={{width: '50px', height: '50px'}} src={row.imgHostUrl + row.imgZoomUrl} alt="" />) }
  }, {
    title: '商品名称',
    dataIndex: 'goodsName',
  }, {
    title: '商品分组',
    dataIndex: 'groupName',
  }, {
    title: '价格',
    dataIndex: 'price',
  }, {
    title: '库存',
    dataIndex: 'number',
   }, {
    title: '发布状态',
    render: (row) => {
      return (
        <div>
          {
            row.status === 0 ? '待上架' : row.status === 1 ? '已上架' :
            row.status === 2 ? '已下架' : row.status === 3 ? '已售完' : row.status
          }
        </div>
      )
    }
  }, {
    title: '云仓商品',
    render: (row) => {
      return (
        <div>{row.inCloud === 1 ? '是' : '否'}</div>
      )
    }
}];

class addGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      groupOptions: [],
      spinStat: true,
      total: 0,
      goodsList: [], // 商品列表数据
      goodsName: '',
      groupId: 0,
      status: "",
      pageSize: 10,
      pageNow: 1,
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getGoodsList()
    this.getGroupNameList()
  }

  getGroupNameList() {
    const userInfo = authorization.getUserInfo();
    listShopGroupName({ shopId: userInfo.shopId }).then((res) => {
      if(res.status === 0) {
        this.setState({
          groupOptions: res.body.shopGroupList
        })
      }
    })
  }

  getGoodsList(){
    const { filterGoods } = this.props;
    const { goodsName, groupId, status, pageSize, pageNow } = this.state;
    const goodsIds = filterGoods.reduce((_row, __values) => ([..._row, __values.goodsId]), [])
    const userInfo = authorization.getUserInfo();
    const orderData = {
      goodsName: goodsName,
      groupId: groupId,
      status: status,
      pageSize: pageSize,
      pageNow: pageNow,
      'goodsId[]': goodsIds,
      enterpriseId: userInfo.enterpriseId,
      shopId: userInfo.shopId,
    }
    getGoodsByShopId(orderData).then((res) => {
      if(res.status === 0) {
        this.setState({
          total: res.goodsNum,
          goodsList: res.goods,
          spinStat: false,
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  
  // 添加商品
  _addGoods() {
    const { addGoodsList, goBack } = this.props;
    const { selectedRowKeys, goodsList } = this.state;
    if(selectedRowKeys.length === 0){
      message.warning('请选择添加的商品')
    }else{
      let orderData = goodsList.filter((e, _index) => {
        return selectedRowKeys.includes(_index)
      })
      // orderData = orderData.reduce((_orderData, value) => ([..._orderData, {
      //   goodsName: value.goodsName,
      //   hostUrl: value.imgHostUrl,
      //   fileUrl: value.imgFileUrl,
      //   zoomUrl: value.imgZoomUrl,
      //   goodsId: value.goodsId,
      // }]), [])
      addGoodsList(orderData)
      goBack()
    }
  }

  // 搜索商品
  _search() {
    this.formRef.validateFields((err, res) => {
      if(err) {
        return
      }
      this.setState({...res})
      setTimeout(() => {
        this.getGoodsList()
      }, 100);
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
    })
  }

  changePage(page, pageSize) {
    this.setState({
      pageNow: page,
      pageSize: pageSize,
    })
    const self = this;
    setTimeout(() => {
      self.getGoodsList()
    }, 100);
  }

  changePageSize(current, size) {
    this.setState({
      pageNow: current,
      pageSize: size,
      spinStat: true,
    })
    const self = this;
    setTimeout(() => {
      self.getGoodsList()
    }, 100);
  }

  render() {
    const { 
      selectedRowKeys, 
      total, 
      goodsList, 
      pageSize, 
      pageNow, 
      spinStat, 
      groupOptions 
    } = this.state;
    const { goBack } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.container}>
        <BlockHead 
          leftText="商品列表" 
          goBackBt={goBack} 
          addBt={this._addGoods.bind(this)} 
          searchBt={this._search.bind(this)} 
        />
        <SearchForm ref={(form) => this.formRef = form} groupOptions={groupOptions} />
        <Row>
          <Spin spinning={spinStat} delay={500}>
            <Table 
              rowSelection={rowSelection} 
              columns={columns} 
              dataSource={goodsList} 
              pagination={false}  
            />
            <Row className={styles.pagination}>
              <Pagination 
                total={total} 
                showSizeChanger 
                showQuickJumper 
                defaultPageSize={pageSize} 
                defaultCurrent={pageNow}
                onChange={this.changePage.bind(this)} 
                onShowSizeChange={this.changePageSize.bind(this)}
              />
            </Row>
          </Spin>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { shopModel: state.shopModel }
}

export default connect(mapStateToProps)(addGoods);
