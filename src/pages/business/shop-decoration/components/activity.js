import React, { Component } from 'react';
import styles from '../index.less';
import BlockHead from './blockHead/index';
import { Row, Table, Button, Pagination, Modal, message } from 'antd';
import router from 'umi/router';
import { deleteActivity } from '../api/index.js';
import { authorization, config } from 'utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Activity extends Component {
 
  _getData(pageIndex, pageSize) {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    dispatch({type: 'shopModel/getAtivityList', payload: {
      shopId: userInfo.shopId, 
      enterpriseId: userInfo.enterpriseId,
      userId: userInfo.userId,
      pageIndex: pageIndex,
      pageSize: pageSize,
    }})
  }

  _update() {
    const { data } = this.props
    this._getData(data.pageIndex, data.pageSize)
  }

  componentDidMount() {
    this._update()
  }

  changePage(page, pageSize) {
    this._getData(page, pageSize)
  }

  changePageSize(current, size) {
    this._getData(current, size)
  }

  render() {
    const { data } = this.props;
    const columns = [{
      title: '页面ID',
      dataIndex: 'activityId',
      key: 'activityId',
    }, {
      title: '页面名称',
      dataIndex: 'title',
    }, {
      title: '创建时间',
      dataIndex: 'createTimeString',
    }, {
      title: '页面URL',
      render: (row) => {
        return (
          <div>{config.LINK_URL + '/multiShop/shopActivity/?activityId='+ row.activityId +'&shopId=' + row.shopId}</div>
        )
      }
    }, {
      title: '操作',
      render: (row) => { 
        return (
          <div className={styles.tabOperate}>
            <a onClick={() => {router.push('/business/shop-decoration/activity/edit/'+row.activityId)}}>详情</a>
            <CopyToClipboard text={config.LINK_URL + '/multiShop/shopActivity/?activityId='+row.activityId+'&shopId='+row.shopId}
              onCopy={() => { message.success('复制成功') } }>
              <a>复制</a>
            </CopyToClipboard>
            <a onClick={() => {
              Modal.confirm({
                title: '提示',
                content: '确认要删除吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  return new Promise((resolve, reject) => {
                    deleteActivity({ userId: 12491983, activityId: row.activityId}).then((res) => {
                      if(res.status === 0){
                        resolve()
                        message.success('删除成功')
                        this._update()
                      } 
                    })
                  })
                },
                onCancel: () => {
                }
              });
            }}>删除</a>
          </div>
        )
      }
    }];

    return (
      <div className={styles.container}>
        <BlockHead 
          leftText="活动页面" 
          leftIcon={3}  
        />
        <div style={{ height: 'auto', padding: '32px' }}>
          <Row style={{ textAlign: 'right', marginBottom: '10px' }}>
            <Button type="primary" ghost onClick={()=> {router.push('/business/shop-decoration/activity/edit/new')}}>新建</Button>
          </Row>
          <Row>
            <Table 
              rowKey={record => record.groupId} 
              dataSource={data.list} 
              columns={columns} 
              pagination={false} 
            />
            <Row className={styles.pagination}>
              <Pagination 
                total={data.total} 
                showSizeChanger 
                showQuickJumper 
                defaultCurrent={data.pageIndex}
                defaultPageSize={data.pageSize}
                onChange={this.changePage.bind(this)} 
                onShowSizeChange={this.changePageSize.bind(this)}
              />
            </Row>
          </Row>
        </div>
      </div>
    )
  }
}

export default Activity;
