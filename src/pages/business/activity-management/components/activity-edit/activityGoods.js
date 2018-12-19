import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Button,
  Table,
  Modal,
  Select,
  Pagination,
  Row,
  Col,
  Input,
  Spin,
  message,
} from 'antd';
import styles from '../../activity-edit/index.less';

const FormItem = Form.Item;
const Option = Select.Option;

const columns = [{
  title: '商品名称',
  dataIndex: 'goodsName',
  key: 'goodsName',
  align: 'center',
}, {
  title: '规格',
  dataIndex: 'specicationInfo',
  key: '0',
  align: 'center',
  render: (value, row, index) => {
    if (value && value.length !== 0) {
      return value.map((item, index) => {
        if (item.param3) {
          return <p className={styles.goods_com} key={index}>{item.param1}/{item.param2}/{item.param3}</p>
        }
        if (item.param2) {
          return <p className={styles.goods_com} key={index}>{item.param1}/{item.param2}</p>
        }
        return <p className={styles.goods_com} key={index}>{item.param1}</p>
      })
    } else {
      return null;
    }
  },
}, {
  title: '正常售价',
  dataIndex: 'specicationInfo',
  key: '1',
  align: 'center',
  render: (value, row, index) => {
    if (value && value.length !== 0) {
      return value.map((item, index) => {
        return <p className={styles.goods_com} key={index}>{item.price}</p>
      })
    } else {
      return null;
    }
  },
}, {
  title: '分润',
  dataIndex: 'specicationInfo',
  key: '2',
  align: 'center',
  render: (value, row, index) => {
    if (value && value.length !== 0) {
      return value.map((item, index) => {
        return <p className={styles.goods_com} key={index}>{item.shareMoney}</p>
      })
    } else {
      return null;
    }
  },
}];

const goodsListTitle = [{
  title: '商品图片',
  dataIndex: 'productImg',
  key: '3',
  render: (value, row, index) => {
    return <img style={{ width: 80, height: 80, }} src={row.imgHostUrl + row.imgZoomUrl}></img>
  },
}, {
  title: '商品名称',
  dataIndex: 'goodsName',
  key: 'goodsName',
  width: 150
}, {
  title: '商品分组',
  dataIndex: 'groupName',
  key: 'groupName',
  width: 150
}, {
  title: '价格',
  dataIndex: 'price',
  key: 'price',
  width: 150
}, {
  title: '库存',
  dataIndex: 'stock',
  key: 'stock',
  width: 150
}, {
  title: '发布状态',
  dataIndex: 'status',
  key: 'status',
  width: 150,
  render: (value, row, index) => {
    if (row && row.status == 0) {
      return '待上架'
    }
    if (row && row.status == 1) {
      return '上架中'
    }
    if (row && row.status == 2) {
      return '已下架'
    }
  },
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  key: 'createTime',
  width: 150
}];

class ActivityGoods extends React.Component {

  constructor(props) {
    super(props)
    this.tableColumn = columns.concat({
      title: '团购价',
      dataIndex: 'specicationInfo',
      key: '3',
      align: 'center',
      render: (value, row, index) => {
        if (value && value.length !== 0) {
          if (this.props.formData && this.props.formData.isStatus && (this.props.formData.isStatus == 1 || this.props.formData.isStatus == 2)) {
            return value.map((item, i) => {
              return <div style={{ height: 40, lineHeight: '40px' }} key={i}>{item.groupPrice}</div>
            })
          }
          return value.map((item, i) => {
            return <div key={i} style={{ width: 100, height: 40, lineHeight: '40px' }}><Input defaultValue={item.groupPrice} type="text" maxLength={11} onKeyUp={this.verifyPrice} onBlur={(e) => this.onChangeGroup(e, index, i)} /></div>
          })
        } else {
          return null;
        }
      },
    }, {
        title: '团购人数阈值',
        dataIndex: 'groupBuys',
        key: 'groupBuys',
        align: 'center',
        render: (value, row, index) => {
          if (this.props.formData && this.props.formData.isStatus && (this.props.formData.isStatus == 1 || this.props.formData.isStatus == 2)) {
            return <div>{value}</div>
          }
          return <div style={{ width: 100 }}><Input defaultValue={value} type="text" maxLength={3} onKeyUp={e => e.target.value = e.target.value.replace(/[^\d]/g, '')} onBlur={(e) => this.onChangeThreshold(e, index)} /></div>
        },
      }, {
        title: '操作',
        dataIndex: 'opration',
        key: 'opration',
        align: 'center',
        width: '15%',
        render: (text, record, index) => {
          if (this.props.formData && (this.props.formData.isStatus !== 1 && this.props.formData.isStatus !== 2)) {
            return (
              <div>
                <a href="javascript:;" onClick={() => this.delGoods(index)}>删除</a>
              </div>
            );
          }
        }
      })
    this.state = {
      visible: false,
      loading: true,
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  // 在页面销毁时，redux依然存在，由于input 设置的defaultValue的默认值，在进入到其他页面时，依然显示上一个页面中的值
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityDetailModel/setSelectGoodsList',
      payload: {
        selectGoodsList: [],
      },
    });
  }

  // 验证价格和分润
  verifyPrice = (obj) => {
    if (obj.target.value == '0.00') {
      obj.target.value = '';
    }
    obj.target.value = obj.target.value.replace(/[^\d.]/g, "");
    obj.target.value = obj.target.value.replace(/^\./g, "");
    obj.target.value = obj.target.value.replace(/\.{2,}/g, ".");
    obj.target.value = obj.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.target.value = obj.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  }

  // 添加商品弹出框
  showModal = () => {
    const { dispatch, activityDetailModel } = this.props;
    const { selectGoodsId } = activityDetailModel;
    this.setState({
      visible: true,
    });
    dispatch({
      type: 'activityDetailModel/shelvesGoods',
      payload: {
        "goodsId[]": selectGoodsId, // 商品id 固定为0
        groupId: 0, // 商品分组 
        status: 1, // 发布状态 固定为0
        goodsName: '', // 商品名称
        enterpriseId: activityDetailModel.enterpriseId, // 商品所在企业ID
        shopId: activityDetailModel.shopId, // 商品所在店铺ID
        pageSize: activityDetailModel.pageSize, // 每页记录数
        pageNow: activityDetailModel.pageNow, // 当前页
      },
    })
      .then(() => {
        this.setState({
          loading: false,
        })
      });
    dispatch({
      type: 'activityDetailModel/grouping',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        shopId: activityDetailModel.shopId,
        name: '',
        createTime: '',
        endTime: '',
      },
    });
  }

  // 设置团购价
  onChangeGroup = (e, index, i) => {
    const { selectGoodsList } = this.props.activityDetailModel;
    const { dispatch } = this.props;
    selectGoodsList[index].specicationInfo[i].groupPrice = e.target.value;
    dispatch({
      type: 'activityDetailModel/setSelectGoodsList',
      payload: {
        selectGoodsList: selectGoodsList,
      },
    });
  }

  // 设置团购人数或阈值
  onChangeThreshold = (e, index) => {
    const { selectGoodsList } = this.props.activityDetailModel
    selectGoodsList[index].groupBuys = e.target.value;
  }

  // 取消弹框
  handleCancel = (e) => {
    this.setState({
      visible: false,
      selectedRowKeys: [],
    })
  }

  // 删除选择的商品
  delGoods = (id) => {
    const { selectGoodsList, selectGoodsId } = this.props.activityDetailModel;
    const { dispatch } = this.props;
    selectGoodsList.splice(id, 1)
    selectGoodsId.splice(id, 1)
    dispatch({
      type: 'activityDetailModel/setSelectGoodsList',
      payload: {
        selectGoodsList: selectGoodsList,
      },
    });
    dispatch({
      type: 'activityDetailModel/setSelectGoodsId',
      payload: {
        selectGoodsId: selectGoodsId,
      },
    });
  }

  //设置PageSize
  setShowSizeChange = (current, pageSize) => {
    const { dispatch, activityDetailModel } = this.props;
    const { selectGoodsId } = activityDetailModel;
    dispatch({ type: 'activityDetailModel/setPageShowSize', payload: { pageSize } });
    dispatch({ type: 'activityDetailModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({
      type: 'activityDetailModel/shelvesGoods',
      payload: {
        pageNow: 1,
        pageSize,
        "goodsId[]": selectGoodsId, // 商品id 固定为0
        ...activityDetailModel.searchData,
        status: 1, // 发布状态 固定为0
        enterpriseId: activityDetailModel.enterpriseId, // 商品所在企业ID
        shopId: activityDetailModel.shopId, // 商品所在店铺ID
      }
    });
  };

  //设置PageNow
  setNewPageNow = (pageNow) => {
    const { dispatch, activityDetailModel } = this.props;
    const { selectGoodsId } = activityDetailModel;
    dispatch({ type: 'activityDetailModel/setPageNow', payload: { pageNow } });
    dispatch({
      type: 'activityDetailModel/shelvesGoods',
      payload: {
        ...activityDetailModel.searchData,
        pageNow,
        status: 1, // 发布状态 固定为0
        "goodsId[]": selectGoodsId, // 商品id 固定为0
        enterpriseId: activityDetailModel.enterpriseId,
        pageSize: activityDetailModel.pageSize,
        shopId: activityDetailModel.shopId, // 商品所在店铺ID
      }
    });
  };

  //搜索已上架商品
  getSearchData = (e) => {
    e.preventDefault();
    const { dispatch, activityDetailModel } = this.props;
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      dispatch({ type: 'activityDetailModel/setPageNow', payload: { pageNow: 1 } });
      dispatch({ type: 'activityDetailModel/setSearchData', payload: { searchData: values } });
      dispatch({
        type: 'activityDetailModel/shelvesGoods',
        payload: {
          "goodsId[]": activityDetailModel.selectGoodsId, // 商品id 固定为0
          groupId: values.groupId, // 商品分组 
          status: 1, // 发布状态 固定为0
          goodsName: values.goodsName, // 商品名称
          enterpriseId: activityDetailModel.enterpriseId, // 商品所在企业ID
          shopId: activityDetailModel.shopId, // 商品所在店铺ID
          pageSize: 10, // 每页记录数
          pageNow: 1, // 当前页
        },
      })
        .then(() => {
          this.setState({
            loading: false,
          })
        });
    });
  }

  // 商品选择完成
  onComplete = () => {
    const { selectedRows } = this.state;
    const { dispatch, activityDetailModel } = this.props;
    const { selectGoodsList, selectGoodsId } = activityDetailModel;
    if (selectedRows.length == 0) {
      message.warning('请选择要添加的商品')
      return;
    }
    for (let i = 0; i < selectedRows.length; i++) {
      selectGoodsList.push(selectedRows[i])
      selectGoodsId.push(selectedRows[i].goodsId)
    }
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  // 商品多选和反选
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRows);
    console.log(selectedRowKeys)
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys
    })
  }

  render() {
    const { loading, visible, selectedRowKeys } = this.state;
    const { formData, id } = this.props;
    const { goodsList, pageNow, goodsTotal, goodsGrouping, selectGoodsList, searchData } = this.props.activityDetailModel;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.info_edit}>
        <div className={styles.activity_title}>
          <label>活动商品</label>
          <div className={styles.add_goods}>
            {(formData && (formData.isStatus == 0 || id == '0')) ? <Button type="primary" ghost onClick={this.showModal}>添加商品</Button> : null}
          </div>
        </div>
        {selectGoodsList ?
          <Table columns={this.tableColumn}
            dataSource={selectGoodsList}
            pagination={false}
            rowKey={(r, i) => i}
            className={styles.goods_table}
          /> : null
        }
        <Modal
          width={740}
          style={{ overflowY: 'scroll', maxHeight: 700 }}
          title="已上架商品"
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <GoodsSearch ref={(form) => this.form = form}
            getSearchData={(e) => this.getSearchData(e)}
            onComplete={this.onComplete}
            {...goodsGrouping}
            {...searchData}
          />
          <Spin size="large" spinning={loading}>
            <Table columns={goodsListTitle}
              dataSource={goodsList}
              pagination={false}
              rowSelection={rowSelection}
              rowKey={(r, i) => r.goodsId} />
            <div style={{ paddingTop: '10px' }}>已选择<span style={{ color: 'red' }}>{selectedRowKeys.length}</span>个商品</div>
            {goodsList.length > 0 ?
              <Pagination showSizeChanger current={pageNow}
                defaultPageSize={5}
                onShowSizeChange={this.setShowSizeChange}
                onChange={this.setNewPageNow} total={goodsTotal}
                pageSizeOptions={['5', '10', '20', '50']}
                className={styles.pagination} showQuickJumper />
              : <div className="bottomDiv"></div>}
          </Spin>
        </Modal>
      </div>
    );
  }
}

const GoodsSearch = Form.create()(
  (props) => {
    const { form, getSearchData, onComplete, list, searchData } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    return (
      <div>
        <Form onSubmit={getSearchData}>
          <Row>
            <Col span={9}>
              <FormItem {...formItemLayout} label="商品名称">
                {getFieldDecorator('goodsName', { initialValue: props.goodsName })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem {...formItemLayout} label="商品分组">
                {getFieldDecorator('groupId', { initialValue: props.groupId })(
                  <Select>
                    <Option value={0}>全部</Option>
                    {list && list.length !== 0 ?
                      list.map((item, index) => {
                        return <Option key={index} value={item.groupId}>{item.name}</Option>
                      }) : null
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <Button style={{ marginTop: '5px' }} type="primary" htmlType="submit">查找</Button>
              <Button style={{ marginTop: '5px', marginLeft: '30px' }} type="primary" onClick={onComplete}>添加</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
)

const mapStateToProps = (state) => {
  return { activityDetailModel: state.activityDetailModel };
};

export default connect(mapStateToProps)(ActivityGoods)