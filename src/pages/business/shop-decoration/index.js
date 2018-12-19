import React, { Component } from 'react';
import BaseInfo from './components/baseInfo';
import ShopStyle from './components/shopStyle';
import ShopDesign from './components/shopDesign';
import Activity from './components/activity';
import PreviewPage from './components/preview/index';
import { connect } from 'dva';
import { authorization } from "utils";

class ShopDecoration extends Component {
  
  componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    dispatch({type: 'shopModel/getShopInfo', payload: {shopId: userInfo.shopId} })
    dispatch({type: 'shopModel/getBanners', payload: {shopId: userInfo.shopId} })
    dispatch({type: 'shopModel/getPartitions', payload: {shopId: userInfo.shopId} })
    dispatch({type: 'shopModel/getAllActivity', payload: {
      shopId: userInfo.shopId, 
      enterpriseId: userInfo.enterpriseId,
      userId: userInfo.userId,
      pageIndex: 1,
      pageSize: 9999,
    }})
    dispatch({type: 'shopModel/changePreviewStat', payload: false })
  }

  render() {
    const { shopModel, dispatch } = this.props;
    const { 
      bannerList, 
      partitionList, 
      groupList, 
      sortKey, 
      shopThemeInfo, 
      activityInfo,
      allActivity,
      previewStat,
      curGpstyle,
    } = shopModel;
    const { shopFormwork } = shopThemeInfo;
    const designParams = {
      bannerList: bannerList,
      dispatch: dispatch,
      partitionList: partitionList,
      groupList: groupList,
      sortKey: sortKey,
      shopThemeInfo: shopThemeInfo,
      allActivity: allActivity,
      curGpstyle: curGpstyle,
    }
    return (
      <div>
          <div style={{ display: previewStat ? 'none' : 'block' }}>
            <BaseInfo data={shopModel} dispatch={dispatch} />
            <ShopStyle data={shopModel} dispatch={dispatch} />
            <ShopDesign {...designParams} />
            {shopFormwork.includes('d') ? <Activity data={activityInfo} dispatch={dispatch} /> : null}
          </div>
        {
         previewStat ? <PreviewPage /> : null
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { shopModel: state.shopModel }
}

export default connect(mapStateToProps)(ShopDecoration);
