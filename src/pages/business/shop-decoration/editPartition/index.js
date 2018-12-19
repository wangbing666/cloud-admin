import React, { Component } from 'react';
import styles from './index.less';
import BlockHead from '../components/blockHead/index';
import { Row, Col, Form, Input, Select, Switch, Upload, Icon, Modal, message, Button, Spin } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { getPartitions } from '../api/index';
import AddGoods from '../components/addGoods/index.js'
import { listShopGroupName, getlistShopGroup, saveOrUpdatePartition } from '../api/index';
import { authorization, uploadQiniu } from 'utils';


const FormItem = Form.Item;
const Option = Select.Option;

const showGoodsSum = [
  [1, 2, 3, 4, 5, 6, 7],
  [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
]

const DesignA = () => {
  return (
    <div className={styles.goodsListA}>
      <div className={styles.goodItem}></div>
      <div className={styles.goodItem}></div>
    </div>
  )
}

const DesignB = () => {
  return (
    <div className={styles.goodsListB}>
      <div className={styles.goodItem}></div>
      <div className={styles.goodItem}></div>
    </div>
  )
}

const DesignC = () => {
  return (
    <div className={styles.goodsListC}>
      <div className={styles.goodItem}></div>
      <div className={styles.goodItem}></div>
      <div className={styles.goodItem}></div>
    </div>
  )
}

class SubregForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fileId: 0,
      imageUrl: ''
    }
  }

  componentDidUpdate(preProps) {
    if (this.props.current !== preProps.current) {
      this.formRef.resetFields();
    }
  }

  async beforeUpload(file) {
    const { changeBgImg } = this.props;
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJPG) {
      message.error('请上传 IMG png 格式图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片不能超过 2MB!');
    }
    if (isJPG && isLt2M) {
      const formData = new FormData();
      formData.append('file', file, 'file');
      const resultData = await uploadQiniu(formData, {
        width: 750,
        height: 400,
        originHeight: 200,
        originWidth: 325,
      })
      if (resultData) {
        changeBgImg(resultData)
      }
    }
    return false
  }

  validatorFileId = (rule, value, callback) => {
    const { data } = this.props;
    if (data.fileId) {
      callback();
    } else {
      callback('请上传Banner');
    }
  }

  validatorTitle = (rule, value, callback) => {
    if (value && (value.length === 1 || value.length > 10)) {
      callback('请输入2~10字的标题');
    } else if (value && !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
      callback('禁止输入特殊字符');
    } else {
      callback()
    }
  }

  render() {
    const { form, data, changeType, changeGoodsNum } = this.props;
    const { getFieldDecorator } = this.formRef = form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20, offset: 1 }
    }

    const imageUrl = data.backGroupHostUrl + data.backGroupFileUrl
    const isShow = data.isShow === 1 ? true : false;
    return (
      <div>
        <Form>
          <FormItem {...formItemLayout} label="分区标题">
            <Row>
              <Col span={10}>
                {getFieldDecorator('title', {
                  initialValue: data.title,
                  rules: [{
                    required: true, message: '请输入标题!',
                  }, {
                    validator: this.validatorTitle,
                  }],
                })(
                  <Input maxLength="10" />
                )}
              </Col>
              <Col span={10} offset={2}>
                <span className={styles.diyLabel}>前端展示</span>
                {getFieldDecorator('isShow', {
                  valuePropName: 'checked',
                  initialValue: isShow,
                })(
                  <Switch />
                )}
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="样式">
            <Row>
              <Col span={10}>
                {
                  getFieldDecorator('formworkId', {
                    initialValue: data.templateType,
                  })(
                    <Select onChange={changeType}>
                      <Option value={1}>样式一</Option>
                      <Option value={2}>样式二</Option>
                      <Option value={3}>样式三</Option>
                    </Select>
                  )
                }
              </Col>
            </Row>
            <Row type="flex" align="bottom">
              <Col span={10}>
                <div className={styles.showDesign}>
                  <div className={styles.banner}>
                    banner
                    </div>
                  {data.templateType === 3 ? <DesignA /> : data.templateType === 2 ? <DesignB /> : data.templateType === 1 ? <DesignC /> : null}
                </div>
              </Col>
              <Col span={8} offset={2}>
                <span className={styles.diyLabel}>产品展示数量</span>
                <Select style={{ width: '100px' }} value={data.goodsNum} onChange={changeGoodsNum}>
                  {
                    showGoodsSum[data.templateType - 1].map((item) => {
                      return <Option key={item} value={item}>{item}</Option>
                    })
                  }
                </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="分区banner" {...formItemLayout}>
            {
              getFieldDecorator('fileId', {
                initialValue: [1],
                rules: [{
                  required: true, message: ' ',
                }, {
                  validator: this.validatorFileId,
                }],
              })(
                <Upload
                  listType="picture-card"
                  beforeUpload={this.beforeUpload.bind(this)}
                  showUploadList={false}
                  className="parition-banner-uploader">
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 350, height: 200 }} /> : <Button size="small">上传</Button>}
                </Upload>
              )
            }
            <p>推荐上传图片尺寸：750px * 400px，图像大小不超过2M</p>
          </FormItem>
          <FormItem label="banner链接" {...formItemLayout}>
            <Row>
              <Col span={18}>
                {
                  getFieldDecorator('bannerUrl', {
                    initialValue: data.bannerUrl,
                  })(
                    <Input />
                  )
                }
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const CreateSubregForm = Form.create()(SubregForm);

// 推荐商品
const RecommendCommodities = (props) => {
  const {
    data,
    deleteGoods,
    showGoods,
    groupList,
    autoSync,
    onSyncSwitch,
    changeGroupId,
    changeGoodsStat,
    autoSyncGoodsStat,
    autoSyncGroupId,
  } = props;
  const { goodsFiles } = data;
  return (
    <div className={styles.recommendCommodities}>
      <Row>
        <Col span={16} offset={6}>
          <Row>
            <Col span={3}>
              <span className={styles.recommendTitle}>推荐商品 :</span>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              <div className={styles.recommendConsole}>
                <a>自动同步</a>
                {
                  groupList.length === 0 ? null : <Select value={autoSyncGroupId} className={styles.blockMargin} style={{ width: 150 }} onChange={changeGroupId}>
                    {
                      groupList.map((value) => {
                        return <Option key={value.groupId} value={value.groupId}>{value.groupName}</Option>
                      })
                    }
                  </Select>
                }
                <Select value={autoSyncGoodsStat} className={styles.blockMargin} onChange={changeGoodsStat}>
                  <Option value={0}>全部</Option>
                  <Option value={1}>待上架</Option>
                  <Option value={2}>已上架</Option>
                  <Option value={3}>已下架</Option>
                  <Option value={4}>已售完</Option>
                </Select>
                <Switch className={styles.blockMargin} checked={autoSync} onChange={onSyncSwitch} />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={16} offset={6}>
          <ul className={styles.commoditieList}>
            {goodsFiles.map((e, index) => {
              return (
                <li key={e.goodsId}>
                  <span className={styles.showImg}>
                    <img src={e.hostUrl + e.fileUrl} alt="" />
                  </span>
                  <span className={styles.showName}>
                    <span>{e.goodsName}</span>
                    <Icon className={styles.closeIcon} type="close" onClick={() => deleteGoods(index)} />
                  </span>
                </li>
              )
            })}
            {
              autoSync ? null : <li style={{ display: 'flex' }}>
                <Icon
                  type="plus"
                  style={{ margin: 'auto', fontSize: '60px' }}
                  onClick={showGoods}
                />
              </li>
            }
          </ul>
        </Col>
      </Row>
    </div>
  )
}

class EditSubregion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPageType: true,
      currentId: 0,
      partitionList: [],
      currentData: {
        goodsFiles: [],
        templateType: 1,
        isShow: 1,
        bannerUrl: '',
        goodsNum: 1,// 商品数量
      },
      groupList: [], // 分组列表-下拉数据
      autoSync: false,
      autoSyncGroupId: 0, // 自动同步-分组
      autoSyncGoodsStat: 0, // 自动同步-商品状态
      renderStat: false,
    }
  }

  async componentDidMount() {
    const userInfo = authorization.getUserInfo();
    const queryId = this.props.location.query.partitionId
    const data = await getPartitions({ shopId: userInfo.shopId })
    if (data.status === 0) {
      const currentData = data.body.partitions.filter((e) => (e.partitionId == queryId))
      let copyData = currentData[0] === undefined ? { goodsFiles: [], templateType: 1, isShow: 1, bannerUrl: '', goodsNum: 1 } : JSON.stringify(currentData[0])
      copyData = currentData[0] === undefined ? copyData : JSON.parse(copyData)
      this.setState({
        currentId: queryId === undefined ? 'new' : queryId,
        partitionList: data.body.partitions,
        currentData: copyData,
        renderStat: true,
      })
    }
    listShopGroupName({
      shopId: userInfo.shopId,
    }).then((res) => {
      if (res.status === 0) {
        this.setState({
          groupList: res.body.shopGroupList,
          autoSyncGroupId: res.body.shopGroupList[0].groupId,
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  goBack(res) {
    router.goBack();
  }

  _save() {
    this.formRef.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { currentData } = this.state
      const { dispatch } = this.props;
      const userInfo = authorization.getUserInfo();
      const allGoodsId = currentData.goodsFiles.reduce((_sum, goods) => ([..._sum, goods.goodsId]), [])
      let orderData = {
        partitionId: currentData.partitionId ? currentData.partitionId : 0,
        fileId: currentData.fileId,
        shopId: userInfo.shopId,
        goodsNum: currentData.goodsNum,
        'goodsId[]': allGoodsId
      }
      Object.keys(values).forEach((key) => {
        if (key === 'isShow') {
          orderData[key] = values[key] ? 1 : 0
        } else if (key !== 'fileId') {
          orderData[key] = values[key]
        }
      })
      // 特殊字符转义 & 
      if (orderData.bannerUrl) {
        if (orderData.bannerUrl.indexOf('&') > -1) {
          orderData.bannerUrl = orderData.bannerUrl.replace('&', '%26')
        }
      }
      if (allGoodsId.length === 0) {
        message.error('请添加商品');
      } else {
        saveOrUpdatePartition(orderData).then((res) => {
          if (res.status === 0) {
            dispatch({ type: 'shopModel/setPartitionCount', payload: { partitionCount: 1 } })
            message.success('成功')
            router.goBack()
          } else {
            message.error(res.msg)
          }
        })
      }
    });
  }

  // 切换tab
  changeTab = (id) => {
    const { partitionList } = this.state;
    if (id === 'new') {
      this.setState({
        currentId: id,
        currentData: { goodsFiles: [], templateType: 1, isShow: 1, bannerUrl: '', goodsNum: 1 },
        autoSync: false,
        autoSyncGoodsStat: 0,
      })
    } else {
      const currentData = partitionList.filter((e) => (e.partitionId === id))
      let copyData = currentData[0] === undefined ? { goodsFiles: [], templateType: 1, isShow: 1, bannerUrl: '', goodsNum: 1 } : JSON.stringify(currentData[0])
      copyData = currentData[0] === undefined ? copyData : JSON.parse(copyData)
      this.setState({
        currentId: id,
        currentData: copyData,
        autoSync: false,
        autoSyncGoodsStat: 0,
      })
    }
  }

  changeType(res) {
    let currentData = Object.assign({}, this.state.currentData);
    currentData['templateType'] = res;
    currentData['goodsNum'] = 1;
    this.setState({
      currentData: { ...currentData },
    })
  }

  changeGoodsNum(res) {
    let currentData = Object.assign({}, this.state.currentData);
    currentData['goodsNum'] = res;
    this.setState({
      currentData: { ...currentData },
    })
  }

  // 删除商品
  deleteGoods(res) {
    let { currentData } = this.state;
    currentData.goodsFiles.splice(res, 1)
    this.setState({
      currentData: currentData,
    })
  }

  // 商品页面 返回 分区编辑页面
  _goBack() {
    this.setState({
      showPageType: true
    })
  }

  // 显示商品添加页面
  showGoods() {
    this.setState({
      showPageType: false,
    })
  }

  // 确认添加商品
  addGoodsList(res) {
    const { currentData } = this.state;
    const formatData = res.reduce((_orderData, value) => ([..._orderData, {
      goodsName: value.goodsName,
      hostUrl: value.imgHostUrl,
      fileUrl: value.imgFileUrl,
      zoomUrl: value.imgZoomUrl,
      goodsId: value.goodsId,
    }]), [])
    currentData.goodsFiles = [...currentData.goodsFiles, ...formatData]
    this.setState({
      currentData: { ...currentData },
    })
  }

  // 自动同步params - groupId
  changeGroupId(res) {
    this.setState({
      autoSyncGroupId: res,
    })
  }

  // 自动同步params - goodsStatus
  changeGoodsStat(res) {
    this.setState({
      autoSyncGoodsStat: res
    })
  }

  // 自动同步商品
  onSyncSwitch(res) {
    if (res) {
      Modal.confirm({
        title: '提示',
        content: '切换到自动同步或导致已定义的推荐商品失效，是否继续？',
        okText: '继续',
        cancelText: '取消',
        onOk: () => {
          const { currentData, autoSyncGroupId, autoSyncGoodsStat } = this.state;
          const userInfo = authorization.getUserInfo();
          getlistShopGroup({
            groupId: autoSyncGroupId,
            status: autoSyncGoodsStat,
            shopId: userInfo.shopId,
          }).then((result) => {
            if (result.status === 0) {
              const filterGoods = result.body.shopListGroupInfo.reduce((_orderData, value) => ([..._orderData, {
                goodsName: value.goodsName,
                hostUrl: value.imgHostUrl,
                fileUrl: value.imgFileUrl,
                zoomUrl: value.imgZoomUrl,
                goodsId: value.goodsId,
              }]), [])
              currentData.goodsFiles = filterGoods;
              this.setState({
                autoSync: true,
                currentData: currentData
              })
              message.success('同步成功')
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      });
    } else {
      const { currentData } = this.state;
      currentData.goodsFiles = []
      this.setState({
        autoSync: false,
        currentData: { ...currentData }
      })
    }
  }


  // 更换Banner
  changeBgImg(payload) {
    const { currentData } = this.state
    currentData['fileId'] = payload[0].fileId
    currentData['backGroupHostUrl'] = payload[0].hostUrl
    currentData['backGroupFileUrl'] = payload[0].fileUrl
    this.setState({
      currentData: { ...currentData },
    })
  }

  render() {
    const {
      currentData,
      partitionList,
      currentId,
      showPageType,
      groupList,
      autoSync,
      autoSyncGoodsStat,
      autoSyncGroupId,
      renderStat,
    } = this.state;
    const { shopModel } = this.props;
    return (
      <div>
        {
          renderStat ? <div className={styles.container} style={{ display: showPageType ? 'block' : 'none' }}>
            <BlockHead leftText="编辑分区" goBackBt={this.goBack} savetBt={{ event: this._save.bind(this), text: '保存' }} />
            <div className={styles.content}>
              <Row>
                <Col span={6}>
                  <ul className={styles.leftMenu}>
                    {partitionList.map((e) => {
                      return <li
                        className={currentId == e.partitionId ? styles.itemActive : styles.item}
                        key={e.partitionId}
                        onClick={() => this.changeTab(e.partitionId)}>{e.title}</li>
                    })}
                    <li className={currentId === 'new' ? styles.itemActive : styles.item} onClick={() => this.changeTab('new')}>新建</li>
                  </ul>
                </Col>
                <Col span={17}>
                  <CreateSubregForm
                    data={currentData}
                    current={currentId}
                    ref={(inst) => this.formRef = inst}
                    qnVoucher={shopModel.qnVoucher}
                    changeBgImg={this.changeBgImg.bind(this)}
                    changeType={(type) => this.changeType.bind(this)(type)}
                    changeGoodsNum={this.changeGoodsNum.bind(this)}
                  />
                </Col>
              </Row>
              <hr style={{ background: '#E9E9E9', marginTop: '50px' }} />
              <RecommendCommodities
                data={currentData}
                deleteGoods={this.deleteGoods.bind(this)}
                showGoods={this.showGoods.bind(this)}
                groupList={groupList}
                autoSync={autoSync}
                autoSyncGoodsStat={autoSyncGoodsStat}
                autoSyncGroupId={autoSyncGroupId}
                onSyncSwitch={this.onSyncSwitch.bind(this)}
                changeGroupId={this.changeGroupId.bind(this)}
                changeGoodsStat={this.changeGoodsStat.bind(this)}
              />
            </div>
          </div> : <div style={{ textAlign: "center" }}><Spin size="large" /></div>
        }
        {!showPageType ? <AddGoods
          goBack={this._goBack.bind(this)}
          filterGoods={currentData.goodsFiles}
          addGoodsList={this.addGoodsList.bind(this)}
        /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { shopModel: state.shopModel }
}

export default connect(mapStateToProps)(EditSubregion);
