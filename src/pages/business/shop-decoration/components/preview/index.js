import React, { Component } from 'react';
import { connect } from 'dva';
import BlockHead from '../blockHead/index';
import { Icon, Carousel  } from 'antd';
import styles from './index.less';
import { Button } from 'antd-mobile';
import router from 'umi/router';
import previewStyleA from '../../../../../assets/images/shop/previewGroupStyle-0.png';
import previewStyleB from '../../../../../assets/images/shop/previewGroupStyle-1.png';

const PartitionThemeA = (props) => {
  const trimGoods = props.goods.slice(0, 3);
  return (
    <div className={styles.partitionThemeA}>
      {trimGoods.map((e, i) => {
        return (
          <div className={styles.pratitionItem} key={i}>
            <img src={ e.hostUrl + e.fileUrl } alt="" />
            <div className={styles.goodsInfo}>
              <p>{e.goodsName}</p>
              <span>¥{e.price}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const PartitionThemeB = (props) => {
  const trimGoods = props.goods.slice(0, 3);
  return (
    <div className={styles.partitionThemeB}>
      {trimGoods.map((e, i) => {
        return (
          <div className={styles.pratitionItem} key={i}>
            <img src={ e.hostUrl + e.fileUrl } alt="" />
            <div className={styles.goodsInfo}>
              <p>{e.goodsName}</p>
              <span>¥{e.price}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const PartitionThemeC = (props) => {
  const trimGoods = props.goods.slice(0, 3);
  return (
    <div className={styles.partitionThemeC}>
      {trimGoods.map((e, i) => {
        return (
          <div className={styles.pratitionItem} key={i}>
            <img src={ e.hostUrl + e.fileUrl } alt="" />
            <div className={styles.goodsInfo}>
              <p>{e.goodsName}</p>
              <span>¥{e.price}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const GoEdit = (props) => {
  const _goEdit = () => {
    if(props.url) {
      props.goEdit({ type: 1, params: props.url })
    } else if(props.nodeId) {
      props.goEdit({ type: 2, params: props.nodeId })
    }
  }
  return (
    <div className={styles.mask}><Button style={{ margin: 'auto' }} size="small" onClick={_goEdit}>去编辑</Button></div>
  )
}

const GroupStyleA = () => {
  return (
    <div className={styles.groupStyleA}>
      {/* <ul>
        <li>XX-系列</li>
        <li>XX-系列</li>
        <li>XX-系列</li>
        <li><Icon type="down" theme="outlined" /></li>
      </ul> */}
      <img src={previewStyleA} alt="" />
    </div>
  )
}

const GroupStyleB = () => {
  return (
    <div className={styles.groupStyleB}>
      <img src={previewStyleB} alt="" />
    </div>
  )
}

class PreviewShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBlock: ['a', 'b', 'c', 'd'], // 当前页面 需要显示 模块
      pageTitle: '',
    }
  }
  componentDidMount() {
    // const param = this.props.match.params.index;
    const { previewStat } = this.props.shopModel;
    switch(previewStat) {
      case 'shop':
        this.setState({ pageTitle: '店铺预览', showBlock: ['a', 'b', 'c', 'd'] });
        break;
      case 'banner':
        this.setState({ pageTitle: 'banner预览', showBlock: ['b'] });
        break;
      case 'group':
        this.setState({ pageTitle: '分组预览', showBlock: ['c'] });
        break;
      case 'partition':
        this.setState({ pageTitle: '分区预览', showBlock: ['d'] });
        break;
      default:
        this.setState({});
        break;
    }
  }

  goBack() {
    const { dispatch } = this.props;
    dispatch({type: 'shopModel/changePreviewStat', payload: false})
  }

  async goEdit(payload) {
    const { type, params } = payload;
    if (type === 1) {
      router.push(params)
    } else if (type === 2) {
      const { dispatch } = this.props;
      await dispatch({type: 'shopModel/changePreviewStat', payload: false})
      document.getElementById(params).scrollIntoView({behavior: 'smooth'}); 
    }
  }
  render() {
    const { shopThemeInfo, themeColors, baseInfo, bannerList, partitionList, sortKey, curGpstyle } = this.props.shopModel;
    const { colorId, switchStat, shopFormwork } = shopThemeInfo;
    const { pageTitle, showBlock } = this.state;
    return (
      <div>
        <BlockHead leftText={pageTitle} goBackBt={this.goBack.bind(this)} />
        <div className={styles.container}>
          <div className={styles.content}>
            {
            showBlock.includes('a') ? 
              <div className={styles.editItem}>
                <div className={styles.shopHead} style={{ background: themeColors[colorId].color1 }}>
                  <span>
                    <Icon type="user" style={{ color: themeColors[colorId].color3 }} />
                  </span>
                  <span style={{ color: themeColors[colorId].color3 }}>{baseInfo.shopName}</span>
                  <span>
                    <Icon type="search" style={{ color: themeColors[colorId].color3, marginRight: '10px' }} />
                    <Icon type="shopping-cart" style={{ color: themeColors[colorId].color3 }} />
                  </span>
                </div>
                <GoEdit url="/business/shop-decoration/editShopBaseInfo" goEdit={this.goEdit.bind(this)} />
              </div>
            :null
            }

            {
              sortKey.map((e, i) => {
                if(e === 'a') {
                  if(showBlock.includes('b') && shopFormwork.includes('a')){
                    return (
                      <div className={styles.editItem}>
                        <div className={styles.banner}>
                          <Carousel autoplay dots="false">
                            {bannerList.map((e, i) => {
                              return  <div className={styles.bgItem} key={i}>
                                <div style={{ backgroundImage: 'url('+e.hostUrl + e.fileUrl+')', height: 400 }}></div>
                              </div>
                            })}
                          </Carousel>
                        </div>
                        <GoEdit nodeId="banneronly"  goEdit={this.goEdit.bind(this)} />
                      </div>
                    )
                  }
                }else if(e === 'b' && shopFormwork.includes('b')) {
                  if(showBlock.includes('c')) {
                    return (
                      <div className={styles.editItem}>
                        <div className={styles.showGroup}>
                        {
                          curGpstyle === 1 ? <GroupStyleA /> : curGpstyle === 2 ? <GroupStyleB /> : null
                        }
                        </div>
                        <GoEdit nodeId="grouponly"  goEdit={this.goEdit.bind(this)} />
                      </div>
                    )
                  }
                }else if(e === 'c' && shopFormwork.includes('c')) {
                  if(showBlock.includes('d')){
                    return (
                      partitionList.map((e, i) => {
                        return (
                          <div className={styles.editItem} key={i}>
                            <div className={styles.showPratition}>
                              <div className={styles.pratitonHead} style={{ background: themeColors[colorId].color1 }}>
                                <hr style={{ border: '1px solid' + themeColors[colorId].color3 }} />
                                <span style={{ color: themeColors[colorId].color3 }} >{e.title}</span>
                                <hr style={{ border: '1px solid' + themeColors[colorId].color3 }}  />
                              </div>
                              <div className={styles.pratitionBanner} style={{ backgroundImage: 'url('+ e.backGroupHostUrl + e.backGroupFileUrl + ')' }}>
                              </div>
                              {e.templateType === 3 ? 
                              <PartitionThemeA goods={e.goodsFiles} /> : e.templateType === 2 ? 
                              <PartitionThemeB goods={e.goodsFiles} /> : e.templateType === 1 ?  
                              <PartitionThemeC goods={e.goodsFiles} /> : null}
                            </div>
                            <GoEdit url={"/business/shop-decoration/editPartition?partitionId=" + e.partitionId } goEdit={this.goEdit.bind(this)} />
                          </div>
                        )
                      })
                    )
                  }
                }else {
                  return null
                }
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { shopModel: state.shopModel }
}

export default connect(mapStateToProps)(PreviewShop);
