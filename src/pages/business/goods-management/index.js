/**
 * Created by wangbing on 2018/6/6.
 * 商品管理
 */
import React from 'react';
import { Button, Spin, Table, Pagination, Divider, Modal, message } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { authorization, config } from 'utils';

import { Search } from './components';
import styles from './index.less';

const columns = [{
  title: '商品图片',
  dataIndex: 'picUrl',
  align: 'center',
  key: 'picUrl',
  width: 90,
  render: (text, row, index) => {
    return <img src={text} className={styles.product_img}></img>
  },
}, {
  title: '商品名称',
  dataIndex: 'goodsName',
  align: 'center',
  key: 'goodsName',
  width: 170,
  render: (text, row, index) => {
    return <Link to={`/business/goods-management/goods-preview/${row.goodsId}`}>{text}</Link>
  },
}, {
  title: '价格',
  dataIndex: 'maxPrice',
  align: 'center',
  key: 'maxPrice',
  width: 180,
  render: (text, row, index) => {
    if (row.minPrice < row.maxPrice) {
      return <span>{row.minPrice} - {row.maxPrice}</span>
    }
    return <span>{row.maxPrice}</span>
  },
}, {
  title: '分润',
  dataIndex: 'shareMax',
  align: 'center',
  key: 'shareMax',
  width: 150,
  render: (text, row, index) => {
    if (row.shareMin < row.shareMax) {
      return <span>{row.shareMin} - {row.shareMax}</span>
    }
    return <span>{row.shareMax}</span>
  },
}, {
  title: '库存',
  dataIndex: 'stock',
  align: 'center',
  key: 'stock',
  width: 90,
}, {
  title: '总销量',
  dataIndex: 'salesVolume',
  align: 'center',
  key: 'salesVolume',
  width: 120,
}, {
  title: '分组名称',
  dataIndex: 'groupName',
  align: 'center',
  key: 'groupName',
  width: 90,
}, {
  title: '发布状态',
  dataIndex: 'status',
  align: 'center',
  key: 'status',
  width: 160,
  render: (text, row, index) => {
    if (text == 0) {
      return <span>待上架</span>
    }
    if (text == 1) {
      return <span>上架中</span>
    }
    if (text == 2) {
      if (row.runStatus == 2) {
        return <div><p>已下架</p><p style={{ color: 'red', fontSize: '12px' }}>商品被撤下</p></div>
      }
      if (row.runStatus == 3) {
        return <div><p>已下架</p><p style={{ color: 'red', fontSize: '12px' }}>商品待审核</p></div>
      }
      return <span>已下架</span>
    }
    if (text == 3) {
      return <span>已售罄</span>
    }
  },
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  align: 'center',
  key: 'createTime',
  width: 170,
  render: (text, row, index) => {
    return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
  },
}, {
  title: '序号',
  dataIndex: 'number',
  align: 'center',
  key: 'number',
  width: 90,
}, {
  title: '云仓商品',
  dataIndex: 'inCloud',
  align: 'center',
  key: 'inCloud',
  width: 90,
  render: (text, row, index) => {
    if (text == 0) {
      return <span>否</span>
    }
    if (text == 1) {
      return <span>是</span>
    }
  },
}];

class GoodsManagement extends React.Component {

  constructor(props) {
    super(props);

    /*
    * productList 批量删除选中的商品
    * title 模态框title
    * ModalText 模态框提示文字
    * okText 模态框按钮文字
    * status 模态框种类 1为删除 2为上架 3为下架
    * goodsId 操作的商品ID
    * copied 复制粘贴板
    */
    this.state = {
      productList: [],
      title: '确认删除',
      ModalText: '是否确认删除该商品',
      okText: '确定',
      status: 1,
      auditting: false,
      audittingDetail: '',
      goodsId: '',
      copied: false,
    };
    this.tableColumn = columns.concat({
      title: '操作',
      dataIndex: 'opration',
      key: 'opration',
      align: 'center',
      width: '15%',
      render: (text, record) => {
        let operation;
        if (record.status == 0 || record.status == 2) {
          operation = <a href="javascript:;" onClick={() => this.onChangShelves(record)}>上架</a>
        }
        if (record.status == 1) {
          operation = <a href="javascript:;" onClick={() => this.onBelowShelves(record.goodsId)}>下架</a>
        }
        if (record.status == 3) {
          operation = "";
        }
        return (
          <div>
            <a href="javascript:;" onClick={() => this.onChangEdit(record)}>编辑</a>
            <Divider type="vertical" />
            {/* <a href="javascript:;" onClick={() => this.generateLink(record.goodsId)}>生成链接</a> */}
            <CopyToClipboard text={`${config.LINK_URL}/multiShop/goodDetails/?goodsId=${record.goodsId}&shopId=${authorization.getUserInfo().shopId}`}
              onCopy={this.onCopy}>
              <a href="javascript:;">生成链接</a>
            </CopyToClipboard>
            <Divider type="vertical" />
            {operation}
          </div>
        );
      }
    })
  }

  componentDidMount() {
    const { dispatch, goodsModel } = this.props;
    const { shopId } = goodsModel;
    dispatch({
      type: 'goodsModel/grouping',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        shopId: shopId,
        name: '',
        createTime: '',
        endTime: '',
      },
    });
    this.initList()
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/setSearchData',
      payload: {
        searchData: {
          groupId: '', // 商品分组ID
          goodsName: "", // 商品名称
          status: "", // 商品状态
          createStartTime: '', // 创建开始时间
          createEndTime: '', // 创建结束时间
          goodsType: "", // 商品类型
          runStatus: 1, // 异常商品
        },
      }
    });
  }

  // 初始化页面
  initList = () => {
    const { dispatch, goodsModel } = this.props;
    dispatch({
      type: 'goodsModel/searchListData',
      payload: {
        ...goodsModel.searchData,
        enterpriseId: goodsModel.enterpriseId,
        shopId: goodsModel.shopId,
        pageNow: goodsModel.pageNow,
        pageSize: goodsModel.pageSize,
      }
    });
  }

  // 生成链接
  onCopy = () => {
    this.setState({ copied: true })
    message.success('复制到粘贴板成功')
  }

  //搜索商品
  getSearchData = (value) => {
    const { dispatch, goodsModel } = this.props;
    dispatch({ type: 'goodsModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({ type: 'goodsModel/setSearchData', payload: { searchData: value } });
    dispatch({
      type: 'goodsModel/searchListData',
      payload: {
        ...value,
        pageNow: 1,
        enterpriseId: goodsModel.enterpriseId,
        shopId: goodsModel.shopId,
        pageSize: goodsModel.pageSize,
      }
    });
    console.log('Received values of form: ', value);
  }

  //设置PageSize
  setShowSizeChange = (current, pageSize) => {
    const { dispatch, goodsModel } = this.props;
    dispatch({ type: 'goodsModel/setPageShowSize', payload: { pageSize } });
    dispatch({ type: 'goodsModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({
      type: 'goodsModel/searchListData',
      payload: {
        ...goodsModel.searchData, pageNow: 1, pageSize, enterpriseId: goodsModel.enterpriseId,
        shopId: goodsModel.shopId,
      }
    });
  };

  //设置PageNow
  setNewPageNow = (pageNow, pageSize) => {
    const { dispatch, goodsModel } = this.props;
    dispatch({ type: 'goodsModel/setPageNow', payload: { pageNow } });
    dispatch({
      type: 'goodsModel/searchListData',
      payload: {
        ...goodsModel.searchData,
        pageNow,
        enterpriseId: goodsModel.enterpriseId,
        shopId: goodsModel.shopId,
        pageSize: goodsModel.pageSize
      }
    });
  };

  // 编辑商品
  onChangEdit = (values) => {
    const { dispatch } = this.props;
    this.setState({
      goodsId: values.goodsId,
    })
    dispatch({
      type: 'goodsModel/isActivity',
      payload: {
        'goodsIds[]': [values.goodsId],
        edit: true,
      }
    });
  }

  // 批量删除弹框
  batchDel = () => {
    const { productList } = this.state
    const { dispatch } = this.props;
    let list = [];
    productList.map((item) => {
      list = [...list, item.goodsId]
    })
    if (productList.length == 0) {
      message.info('请勾选要删除的商品', 3);
    } else {
      dispatch({
        type: 'goodsModel/isActivity',
        payload: {
          'goodsIds[]': list,
        }
      });
      this.setState({
        status: 1,
        title: '确认删除',
        okText: '确认删除',
        ModalText: '是否确认删除该商品',
      });
    }
  }

  // 上架
  onChangShelves = (value) => {
    const { dispatch } = this.props;
    if (value.runStatus == 1) { // 商品正常上架
      dispatch({
        type: 'goodsModel/showModal',
        payload: {
          goodsId: value.goodsId,
        }
      });
    } else if (value.runStatus == 2) { // 商品被运营撤下后
      dispatch({ // 查询商品被撤下原因
        type: 'goodsModel/goodsWhy',
        payload: {
          goodsId: value.goodsId,
        }
      });
      dispatch({ // 弹出原因模态框
        type: 'goodsModel/showDetailModal',
        payload: {
          goodsId: value.goodsId,
        }
      });
    } else { // 商品上架提交复审后
      dispatch({ // 查询申请提交时间
        type: 'goodsModel/CommitTime',
        payload: {
          goodsId: value.goodsId,
        }
      });
      this.setState({
        auditting: true,
      })
    }
    this.setState({
      title: '确认上架',
      status: 2,
      goodsId: value.goodsId,
      okText: '确认上架',
      ModalText: '是否确认上架该商品',
    });
  }

  // 下架
  onBelowShelves = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/isActivity',
      payload: {
        'goodsIds[]': [id],
      }
    });
    this.setState({
      title: '确认下架',
      status: 3,
      goodsId: id,
      okText: '确认下架',
      ModalText: '是否确认下架该商品',
    });
  }

  // 确认操作
  handleOk = () => {
    const { dispatch, goodsModel } = this.props;
    const { status, goodsId, productList } = this.state;
    this.setState({
      ModalText: '操作中，请稍后...',
    });
    if (status == 1) {
      console.log('执行删除操作');
      let list = [];
      productList.map((item) => {
        list = [...list, item.goodsId]
      })
      dispatch({
        type: 'goodsModel/delGoods',
        payload: {
          head: {},
          data: { goodsIdList: list },
        }
      })
        .then(() => {
          this.setState({
            selectedRowKeys: [],
          });
          this.initList()
        })
    }
    if (status == 2) {
      console.log('执行上架操作' + goodsId)
      dispatch({
        type: 'goodsModel/Shelves',
        payload: {
          goodsId: goodsId,
          status: 1,
          shopId: goodsModel.shopId
        }
      })
        .then(() => {
          this.initList()
        })
    }
    if (status == 3) {
      console.log('执行下架操作');
      dispatch({
        type: 'goodsModel/Undergoods',
        payload: {
          goodsId: goodsId,
          status: 2,
          shopId: goodsModel.shopId
        }
      })
        .then(() => {
          this.initList()
        })
    }
  }

  // 取消操作
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsModel/hideModal',
    });
    dispatch({
      type: 'goodsModel/hideEditModal',
    });
  }

  // 确认操作活动中商品
  handleEditOk = () => {
    const { dispatch, goodsModel } = this.props;
    dispatch({
      type: 'goodsModel/StopGoodsInActivity',
      payload: {
        'goodsIds[]': goodsModel.stopActivityGoods,
      }
    })
      .then(() => {
        this.initList()
      })
  }

  // 商品被撤下重新提交
  handleDetailOk = () => {
    const { dispatch } = this.props;
    const { goodsId } = this.state;
    dispatch({
      type: 'goodsModel/Reapply',
      payload: {
        goodsId: goodsId,
      }
    })
      .then(() => {
        this.initList()
      })
  }

  // 去修改
  handleDetailCancel = () => {
    const { goodsId } = this.state;
    const { dispatch } = this.props;
    router.push(`/business/goods-management/goods-edit/${goodsId}`)
    dispatch({
      type: 'goodsModel/hideDetailModal',
    });
  }

  // 审核中确定
  handleOkAuditting = () => {
    this.setState({
      auditting: false,
    })
  }

  // 关闭审核中弹框
  handleCancelAuditting = () => {
    this.setState({
      auditting: false,
    })
  }

  // 商品多选和反选
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRows);
    this.setState({
      productList: selectedRows,
      selectedRowKeys
    })
  }

  render() {
    const { goodsModel } = this.props;
    const { ModalText, title, okText, auditting, selectedRowKeys } = this.state;
    const { searchData, goodsList, pageNow, total, pageSize, showListLoadding, visible, visibleEdit, visibleDetail, confirmLoading, goodsWhy, auditingDate } = goodsModel;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.goodslist}>
        <div className={styles.goodsBody}>
          <div className={styles.cloudHead}>
            <div className={styles.cloudHeadLeft}>
              <span>商品查询</span>
            </div>
          </div>
          <Search ref={(form) => this.form = form}
            getSearchData={(e) => this.getSearchData(e)}
            searchData={searchData} />
          <div className={styles.goods_list_title}>
            <div className={styles.list_title}>
              <span>商品列表</span>
            </div>
            <div className={styles.list_bth}>
              <div className={styles.row} style={{ display: 'inline-block' }}>
                <Button type="primary" ghost onClick={this.batchDel}>批量删除</Button>
              </div>
              <Link to={`/business/goods-management/goods-edit/0`}>
                <Button type="primary" ghost>添加商品</Button>
              </Link>
            </div>
          </div>
          <Spin size="large" spinning={showListLoadding}>
            <div className={styles.tableContent}>
              <Table columns={this.tableColumn}
                dataSource={goodsList}
                pagination={false}
                rowSelection={rowSelection}
                rowKey={(r, i) => r.goodsId} />
            </div>
            {goodsList.length > 0 ?
              <Pagination showSizeChanger current={pageNow}
                onShowSizeChange={this.setShowSizeChange}
                onChange={this.setNewPageNow} total={total}
                defaultPageSize={pageSize}
                className={styles.pagination} showQuickJumper />
              : <div className="bottomDiv"></div>}
          </Spin>
        </div>
        <div>
          <Modal title={title}
            visible={visible}
            onOk={this.handleOk}
            okText={okText}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <p>{ModalText}</p>
          </Modal>
          <Modal
            title="提示"
            visible={visibleEdit}
            onOk={this.handleEditOk}
            onCancel={this.handleCancel}
            confirmLoading={confirmLoading}
            okText="确定修改"
          >
            <p>选中商品正在参与活动</p>
            <p>若编辑/下架/删除商品，则停止当前该商品所有活动</p>
          </Modal>
          <Modal
            title="消息详情"
            className={styles.detail}
            visible={visibleDetail}
            onOk={this.handleDetailOk}
            onCancel={this.handleDetailCancel}
            confirmLoading={confirmLoading}
            okText="重新提交"
            cancelText="去修改"
          >
            <p>你可能由于违反下述规定导致商品被撤下：</p>
            <ul>
              {goodsWhy.map((item, index) => {
                return <li key={index}>{index + 1}.{item ? item.reason : ''}</li>
              })}
            </ul>
            <p>如有疑问请联系客服：021-6079-0010</p>
          </Modal>
          <Modal title="消息详情"
            visible={auditting}
            onCancel={this.handleCancelAuditting}
            footer={null}
          >
            <h3 style={{ textAlign: 'center' }}>审核中</h3>
            <p>资料已提交，提交时间：{auditingDate}</p>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button type="primary" onClick={this.handleOkAuditting}>确定</Button>
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { goodsModel: state.goodsModel }
}

export default connect(mapStateToProps)(GoodsManagement)