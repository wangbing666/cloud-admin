import React, { Component } from 'react';
import styles from '../index.less';
import BlockHead from './blockHead/index';
import { Row, Col, Button, message } from 'antd';
import router from 'umi/router';
import { authorization } from 'utils';

class BaseInfo extends Component {

  previewShop() {
    const { dispatch, data } = this.props;
    const { bannerCount, groupingCount, partitionCount } = data;
    if (bannerCount == 1) {
      message.warning('请将修改的店铺banner保存并发布');
      return;
    }
    if (groupingCount == 1) {
      message.warning('请将修改的店铺分组保存并发布');
      return;
    }
    if (partitionCount == 1) {
      message.warning('请将修改的店铺分区保存并发布');
      return;
    }
    const userInfo = authorization.getUserInfo();
    dispatch({ type: 'shopModel/changePreviewStat', payload: 'shop' })
    dispatch({
      type: 'shopModel/InsertLog',
      payload: {
        shopId: userInfo.shopId,
        type: 1,
      }
    })
  }

  render() {
    const { data } = this.props;
    const { baseInfo } = data;
    return (
      <div className={styles.container}>
        <BlockHead leftText="店铺基本信息" />
        <Row style={{ height: '205px', padding: '50px 32px 65px 32px' }}>
          <Col span={3}>
            <img src={baseInfo.hostUrl + baseInfo.fileUrl} alt='' style={{ height: 100, width: 100 }} />
          </Col>
          <Col span={16}>
            <p style={{ marginBottom: '10px' }}>{baseInfo.shopName}</p>
            <p>店铺介绍：{baseInfo.shopIntrod}</p>
          </Col>
          <Col span={5} style={{ float: 'right', textAlign: 'right' }}>
            <Button type="primary" onClick={() => { router.push('/business/shop-decoration/editShopBaseInfo') }} style={{ marginRight: '10px' }}>编辑</Button>
            <Button type="primary" onClick={this.previewShop.bind(this)}>店铺预览</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default BaseInfo;
