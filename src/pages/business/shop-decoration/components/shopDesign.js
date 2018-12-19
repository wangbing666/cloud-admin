import React, { Component } from 'react';
import styles from '../index.less';
import BlockHead from './blockHead/index';
import { Row, Col, Button, Upload, Icon, Modal, Form, Select, message, Input } from 'antd';
import router from 'umi/router';
import { upOrDownMove, pushBanner, publicPartition, updateStyleId } from '../api/index';
import { authorization, uploadQiniu, checkImgType } from 'utils';
import groupStyle_0 from '../../../../assets/images/shop/groupStyle-0.png';
import groupStyle_1 from '../../../../assets/images/shop/groupStyle-1.png';


const FormItem = Form.Item;
const Option = Select.Option;


const AddBannerForm = Form.create()(
  (props) => {
    const { form, handleCreate, hideModal, modalStat, allActivity, data, changeBgImg, validatorBannerImg, validatorImgUrl } = props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    const beforeUpload = async (file) => {
      const isJPG = checkImgType(file.type);
      if (!isJPG) {
        message.error('请上传jped,jpg,png,git,bmp格式图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      if (isJPG && isLt2M) {
        const formData = new FormData()
        formData.append('file', file, 'file')
        const resultData = await uploadQiniu(formData, {
          width: 100,
          height: 100,
          originHeight: 150,
          originWidth: 150,
        })
        if (resultData) {
          changeBgImg(resultData)
        }
      }
      return false;
    }
    const imageUrl = data.hostUrl + data.zoomUrl
    return (
      <div>
        <Modal
          title="banner上传"
          visible={modalStat}
          onOk={handleCreate}
          onCancel={hideModal}
        >
          <Form>
            <FormItem {...formItemLayout} label="上传封面图片">
              {getFieldDecorator('banner', {
                initialValue: [1],
                rules: [{ required: true, message: ' ' }, {
                  validator: validatorBannerImg
                }],
              })(
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 100, height: 100 }} /> : <Button size="small">上传</Button>}
                </Upload>
              )}
              <p style={{ textAlign: 'left', fontSize: '12px', lineHeight: '20px' }}>推荐尺寸：750*550像素，每张不超过2M，您可以拖拽图片跳转顺序，最多上传9张。</p>
            </FormItem>

            <FormItem  {...formItemLayout} label="图片链接">
              {getFieldDecorator('linkUrl', {
                initialValue: data.linkUrl,
                rules: [{
                  validator: validatorImgUrl
                }],
              })(
                <Input />
              )}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="关联活动页">
            {getFieldDecorator('activityId', {initialValue: data.activityId})(
              <Select>
                {allActivity.list.map((item) => {
                  return  <Option key={item.activityId} value={item.activityId}>{item.title}</Option>
                })}
              </Select>
            )}
          </FormItem> */}
          </Form>
        </Modal>
      </div>
    )
  }
)


const ItemHead = (props) => {
  return (
    <div className={styles.designItemHead}>
      <Row>
        <Col span={9}>
          <span className={styles.headLeft}>{props.title}</span>
        </Col>
        <Col span={15} style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 10 }} type="primary" ghost onClick={() => { props.goPreviewPage(props.onlyId) }}>预览页面</Button>
          <Button style={{ marginRight: 10 }} type="primary" ghost onClick={() => props.savePush(props.onlyId)}>保存并发布</Button>
          <span style={{ marginRight: 10 }}>当前顺序: {props.current + 1}</span>
          <span className={styles.moveCos}>
            {props.current == 0 ? null : <a onClick={() => props.upMove({ ind: props.current, key: props.onlyId })} style={{ marginRight: '10px' }}>上移</a>}
            {props.currentSum == props.current ? null : <a onClick={() => props.nextMove({ ind: props.current, key: props.onlyId })}>下移</a>}
          </span>
        </Col>
      </Row>
    </div>
  )
}

// Banner
const Banner = (props) => {
  const { bannerList, dragStart, dragOver, dragEnd, nextMove, upMove, onlyId, i, openModal, currentSum, deleteBanner, savePush, goPreviewPage } = props;
  return (
    <div className={styles.designItem} id="banneronly">
      <ItemHead
        current={i}
        nextMove={nextMove}
        upMove={upMove}
        title="店铺Banner"
        onlyId={onlyId}
        currentSum={currentSum}
        savePush={savePush}
        goPreviewPage={goPreviewPage}
      />
      <ul
        className={styles.itemList}
        id="banner"
        onDragStart={dragStart}
        onDragOver={dragOver}
        onDragEnd={dragEnd}
      >
        {bannerList.map((e, ind) => {
          return <li className={styles.bannerItem} draggable={true} key={e.fileId}>
            <span className={styles.bgCover} style={{ backgroundImage: 'url(' + e.hostUrl + e.fileUrl + ')' }}></span>
            <span className={styles.controlBt}>
              <a onClick={() => openModal(ind)}>编辑</a>
              <a onClick={() => deleteBanner(ind)}>删除</a>
            </span>
          </li>
        })}
        {
          bannerList.length < 9 ? <li draggable={false} style={{ display: 'flex' }}>
            <Icon type="plus" style={{ margin: 'auto', fontSize: 60 }} onClick={() => openModal('new')} />
          </li> : null
        }
      </ul>
    </div>
  )
}

// 分组
const Grouping = (props) => {
  const { groupList, shopThemeInfo, i, nextMove, upMove, onlyId, currentSum, savePush, curGpstyle, changeGpStyle, goPreviewPage } = props;
  const { groupStyle } = shopThemeInfo;
  return (
    <div className={styles.designItem} id="grouponly">
      <ItemHead
        current={i}
        nextMove={nextMove}
        upMove={upMove}
        title="店铺分组"
        onlyId={onlyId}
        currentSum={currentSum}
        savePush={savePush}
        goPreviewPage={goPreviewPage}
      />
      <Row>
        <p className={styles.groupTitle}>分组样式选择：</p>
        <ul className={styles.itemList}>
          {groupList.map((e, ind) => {
            const imgUrl = ind === 0 ? groupStyle_0 : groupStyle_1
            return (
              <li className={styles.groupItem} onClick={() => changeGpStyle(e.type)}>
                <span
                  className={styles.bgCover}
                  key={ind}
                  style={curGpstyle === e.type ? { border: '1px solid #007AED', backgroundImage: 'url(' + imgUrl + ')', backgroundPosition: 'center', backgroundSize: 'cover' } : { border: '1px solid #d9d9d9', backgroundImage: 'url(' + imgUrl + ')', backgroundPosition: 'center', backgroundSize: 'cover' }}
                ></span>
                <span
                  className={styles.controlBt}
                  style={curGpstyle === e.type ? { border: '1px solid #007AED' } : { border: '1px solid #d9d9d9' }}
                >
                  {groupStyle === e.type ? <a className={styles.active}>使用中</a> : <a className={styles.dafault}>使用</a>}
                </span>
                <p>样式{e.key}</p>
              </li>
            )
          })}
        </ul>
        <p className={styles.groupTitle}>编辑分组：<a onClick={() => { router.push('/business/group-management') }}>去分组>></a></p>
      </Row>
    </div>
  )
}

// 分区
const Subregion = (props) => {
  const { partitionList, nextMove, upMove, onlyId, i, dragStart, dragOver, dragEnd, currentSum, deletePartition, savePush, goPreviewPage } = props;
  return (
    <div className={styles.designItem}>
      <ItemHead
        current={i}
        nextMove={nextMove}
        upMove={upMove}
        title="店铺分区"
        onlyId={onlyId}
        currentSum={currentSum}
        savePush={savePush}
        goPreviewPage={goPreviewPage}
      />
      <ul
        className={styles.itemList}
        id="subregion"
        onDragStart={dragStart}
        onDragOver={dragOver}
        onDragEnd={dragEnd}
      >
        {partitionList.map((e, ind) => {
          return (
            <li className={styles.partitionItem} draggable={true} key={e.partitionId}>
              <span className={styles.partitionBanner} style={{ backgroundImage: 'url(' + e.backGroupHostUrl + e.backGroupZoomUrl + ')' }}></span>
              {
                e.goodsFiles.slice(0, e.templateType === 1 ? 2 : e.templateType === 2 ? 2 : 1).map((goods) => {
                  return (
                    <span
                      key={goods.goodsId}
                      style={{ backgroundImage: 'url(' + goods.hostUrl + goods.fileUrl + ')', backgroundPosition: 'center' }}
                      className={e.templateType === 2 ? styles.partitonGoodTmpB : e.templateType === 1 ? styles.partitonGoodTmpC : styles.partitonGoodTmpA}></span>
                  )
                })
              }
              {
                e.templateType === 1 ? <span className={styles.partitonGoodsMore}>更多</span> : null
              }
              <span className={styles.controlBt}>
                <a onClick={() => { router.push({ pathname: '/business/shop-decoration/editPartition', query: { partitionId: e.partitionId } }) }}>编辑</a>
                <a onClick={() => deletePartition(ind)}>删除</a>
              </span>
            </li>)
        })}
        <li draggable={false} style={{ display: 'flex' }}>
          <Icon type="plus" style={{ margin: 'auto', fontSize: '60px' }} onClick={() => { router.push('/business/shop-decoration/editPartition') }} />
        </li>
      </ul>
    </div>
  )
}

class ShopDesign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerModalStat: false,
      currentShowBannerInfo: {},
      currentBannerIndex: 0, // 打开bannner_index
      dragStart: null,
      dragOver: null
    };
  }

  upMove(res) {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    upOrDownMove({ number: 1, formwork: res.key, shopId: userInfo.shopId, enterpriseId: userInfo.enterpriseId }).then(res => {
      if (res.status === 0) {
        message.success('排序成功')
        dispatch({ type: 'shopModel/getShopThemeInfo', payload: { enterpriseId: userInfo.enterpriseId, shopId: userInfo.shopId } })
      }
    }).catch((err) => {

    })
  }

  nextMove(res) {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();

    upOrDownMove({ number: 2, formwork: res.key, shopId: userInfo.shopId, enterpriseId: userInfo.enterpriseId }).then((res) => {
      if (res.status === 0) {
        message.success('排序成功')
        dispatch({ type: 'shopModel/getShopThemeInfo', payload: { enterpriseId: userInfo.enterpriseId, shopId: userInfo.shopId } })
      }
    }).catch((err) => {

    })
  }

  dragStart(event) {
    if (event.target.nodeName === 'LI') {
      let allEle = Array.from(event.target.parentNode.querySelectorAll('li'));
      let _index = allEle.findIndex((e) => { return e === event.target });
      this.setState({
        dragStart: _index,
      })
    }
  }

  dragOver(event) {
    if (event.target.nodeName === 'SPAN') {
      let allEle = Array.from(event.target.parentNode.parentNode.querySelectorAll('li'));
      let _index = allEle.findIndex((e) => { return e === event.target.parentNode });
      if (this.state.dragStart !== _index && this.state.dragStart !== (allEle.length - 1)) {
        this.setState({
          dragOver: _index,
        })
      }
    }
  }

  dragEnd(event) {
    if (event.target.nodeName === 'LI') {
      const node = event.target.parentNode.id;
      const allEle = Array.from(event.target.parentNode.querySelectorAll('li'));
      const start = this.state.dragStart;
      const over = this.state.dragOver;
      const { bannerList, partitionList, dispatch } = this.props;
      if (start !== null && over !== null && start !== (allEle.length - 1)) {
        let bufferData = node === 'banner' ? bannerList.map((e) => { return Object.assign({}, e) }) : partitionList.map((e) => { return Object.assign({}, e) });
        let targetData = bufferData[start];
        bufferData.splice(start, 1);
        bufferData.splice(over, 0, targetData);
        const sortBanner = () => { dispatch({ type: 'shopModel/sortBanner', payload: bufferData }); }
        const sortPartition = () => { dispatch({ type: 'shopModel/sortPartition', payload: bufferData }); }
        node === 'banner' ? sortBanner() : sortPartition();
      }
    }
  }

  _hideModal = () => {
    this.setState({
      bannerModalStat: false,
    })
  }

  // edit-banner
  _openModal = (ind) => {
    this.formRef.resetFields();
    if (ind !== 'new') {
      const { bannerList } = this.props;
      this.setState({
        currentShowBannerInfo: bannerList[ind],
        bannerModalStat: true,
        currentBannerIndex: ind,
      })
    } else {
      this.setState({
        currentShowBannerInfo: {
          activityId: 0,
          fileId: 0,
          fileUrl: '',
          hostUrl: '',
          linkUrl: '',
          templateId: null,
          zoomUrl: ''
        },
        currentBannerIndex: 'new',
        bannerModalStat: true,
      })
    }
  }

  // 保存banner详情
  _handleCreate = () => {
    this.formRef.validateFields((err, values) => {
      if (err) {
        return err;
      }
      this.formRef.resetFields();
      const { currentShowBannerInfo, currentBannerIndex } = this.state;
      const { dispatch } = this.props;
      const formatData = {
        fileId: currentShowBannerInfo.fileId,
        activityId: values.activityId,
        linkUrl: values.linkUrl,
        hostUrl: currentShowBannerInfo.hostUrl,
        zoomUrl: currentShowBannerInfo.zoomUrl,
        fileUrl: currentShowBannerInfo.fileUrl,
      }
      dispatch({ type: 'shopModel/editBanerInfo', payload: { type: currentBannerIndex, data: formatData } })
      dispatch({ type: 'shopModel/setBannerCount', payload: { bannerCount: 1 } })
      this.setState({
        bannerModalStat: false,
      })
    });
  }

  deleteBanner(ind) {
    const { dispatch } = this.props;
    dispatch({ type: 'shopModel/deleteBanner', payload: ind })
    dispatch({ type: 'shopModel/setBannerCount', payload: { bannerCount: 1 } })
  }

  deletePartition(ind) {
    const { dispatch } = this.props;
    dispatch({ type: 'shopModel/deletePartition', payload: ind })
    dispatch({ type: 'shopModel/setPartitionCount', payload: { partitionCount: 1 } })
  }

  // 修改分组样式
  changeGpStyle(id) {
    const { dispatch } = this.props;
    dispatch({ type: 'shopModel/changeCurGpstyle', payload: id })
    dispatch({ type: 'shopModel/setGroupingCount', payload: { groupingCount: 1 } })
  }

  // banner非空验证
  validatorBannerImg(rules, value, callback) {
    const { currentShowBannerInfo } = this.state;
    if (currentShowBannerInfo.fileId) {
      callback()
    } else {
      callback('请上传banner')
    }
  }
  // 图片url 验证
  validatorImgUrl(rules, value, callback) {
    if (/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value) || !value) {
      callback()
    } else {
      callback('请输入正确格式链接')
    }
  }

  // 修改banner
  changeBgImg(res) {
    const { currentShowBannerInfo } = this.state;
    const resultData = res[0]
    if (resultData) {
      currentShowBannerInfo.fileId = resultData.fileId;
      currentShowBannerInfo.hostUrl = resultData.hostUrl;
      currentShowBannerInfo.zoomUrl = resultData.zoomUrl;
      currentShowBannerInfo.fileUrl = resultData.fileUrl;
      this.setState({
        currentShowBannerInfo: { ...currentShowBannerInfo }
      })
    }
  }

  goPreviewPage = (onlyId) => {
    const { dispatch, partitionList, bannerList } = this.props;
    const userInfo = authorization.getUserInfo();
    switch (onlyId) {
      case 'b':
        dispatch({ type: 'shopModel/changePreviewStat', payload: 'group' })
        dispatch({
          type: 'shopModel/InsertLog',
          payload: {
            shopId: userInfo.shopId,
            type: 3,
          }
        })
        break;
      case 'c':
        if (!partitionList || partitionList.length === 0) {
          Modal.info({
            title: '提示',
            content: '请先添加分区',
            okText: '确认',
          })
        } else {
          dispatch({ type: 'shopModel/changePreviewStat', payload: 'partition' })
          dispatch({
            type: 'shopModel/InsertLog',
            payload: {
              shopId: userInfo.shopId,
              type: 4,
            }
          })
        }
        break;
      case 'a':
        if (!bannerList || bannerList.length === 0) {
          //  message.error('请先添加banner');
          Modal.info({
            title: '提示',
            content: '请先添加banner',
            okText: '确认',
          })
        } else {
          dispatch({ type: 'shopModel/changePreviewStat', payload: 'banner' })
          dispatch({
            type: 'shopModel/InsertLog',
            payload: {
              shopId: userInfo.shopId,
              type: 2,
            }
          })
        }
        break;
      default:
        break;
    }
  }

  // 保存并发布
  savePush(onlyId) {
    const { bannerList, partitionList, dispatch, curGpstyle } = this.props;
    const userInfo = authorization.getUserInfo();
    switch (onlyId) {
      case 'a':
        const orderData = bannerList.reduce((_arr, ob) => ([..._arr, {
          fileId: ob.fileId,
          linkUrl: ob.linkUrl,
          activityId: ob.activityId,
          shopId: userInfo.shopId
        }]), [])
        if (!orderData || orderData.length === 0) {
          //  message.error('请先添加banner');
          Modal.info({
            title: '提示',
            content: '请先添加banner',
            okText: '确认',
          })
        } else {
          pushBanner(orderData).then((res) => {
            if (res.status === 0) {
              dispatch({ type: 'shopModel/setBannerCount', payload: { bannerCount: 0 } })
              message.success('保存成功')
            } else {
              message.error(res.msg)
            }
          }).catch((err) => {
          })
        }
        break;
      case 'b':
        const groupData = {
          styleId: curGpstyle,
          enterpriseId: userInfo.enterpriseId,
          shopId: userInfo.shopId,
        }
        updateStyleId(groupData).then((res) => {
          if (res.status === 0) {
            message.success('提交成功')
            dispatch({ type: 'shopModel/setGroupingCount', payload: { groupingCount: 0 } })
            dispatch({ type: 'shopModel/setGroupStyle', payload: curGpstyle })
          } else {
            message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
        break;
      case 'c':
        const partitionIds = partitionList.reduce((_arr, value) => ([..._arr, value.partitionId]), []);
        if (!partitionIds || partitionIds.length === 0) {
          // message.error('请先添加分区');
          Modal.info({
            title: '提示',
            content: '请先添加分区',
            okText: '确认',
          })
        } else {
          publicPartition({ 'partitions[]': partitionIds }).then((res) => {
            if (res.status === 0) {
              dispatch({ type: 'shopModel/setPartitionCount', payload: { partitionCount: 0 } })
              message.success('提交成功')
            } else {
              message.error(res.msg)
            }
          })
        }
        break;
      default:
        break;
    }
  }

  render() {
    const {
      bannerList,
      partitionList,
      groupList,
      sortKey,
      shopThemeInfo,
      allActivity,
      curGpstyle,
    } = this.props;
    const { currentShowBannerInfo } = this.state;
    const params = {
      nextMove: this.nextMove.bind(this),
      upMove: this.upMove.bind(this),
      dragStart: this.dragStart.bind(this),
      dragOver: this.dragOver.bind(this),
      dragEnd: this.dragEnd.bind(this),
      openModal: this._openModal,
      bannerList: bannerList,
      partitionList: partitionList,
      shopThemeInfo: shopThemeInfo,
      groupList: groupList,
      currentSum: sortKey.length - 1,
      savePush: this.savePush.bind(this),
      goPreviewPage: this.goPreviewPage
    }
    const { shopFormwork } = shopThemeInfo;
    return (
      <div className={styles.container}>
        <BlockHead leftText="店铺设计" leftIcon={2} />
        <Row style={{ height: 'auto', padding: '32px' }}>
          {sortKey.map((e, ind) => {
            if (e === 'a') {
              return shopFormwork.includes('a') ? <Banner {...params} i={ind} onlyId={e} key={e} deleteBanner={this.deleteBanner.bind(this)} /> : null
            } else if (e === 'b') {
              return shopFormwork.includes('b') ? <Grouping {...params} i={ind} onlyId={e} key={e} curGpstyle={curGpstyle} changeGpStyle={this.changeGpStyle.bind(this)} /> : null
            } else if (e === 'c') {
              return shopFormwork.includes('c') ? <Subregion {...params} i={ind} onlyId={e} key={e} deletePartition={this.deletePartition.bind(this)} /> : null
            } else {
              return null
            }
          })}
        </Row>
        <AddBannerForm
          ref={(inst) => this.formRef = inst}
          modalStat={this.state.bannerModalStat}
          handleCreate={this._handleCreate}
          hideModal={this._hideModal}
          allActivity={allActivity}
          data={currentShowBannerInfo}
          changeBgImg={this.changeBgImg.bind(this)}
          validatorImgUrl={this.validatorImgUrl.bind(this)}
          validatorBannerImg={this.validatorBannerImg.bind(this)}
        />
      </div>
    )
  }
}

export default ShopDesign;
