import React, { Component } from 'react';
import BlockHead from '../../components/blockHead/index';
import styles from '../index.less';
import router from 'umi/router';
import { Form, Input, Row, Col, Upload, Modal, Button, Table, message, Select } from 'antd';
import { activityDetail, activityUpAndInsert, getlistShopGroup } from '../../api/index';
import { connect } from 'dva';
import AddGoods from '../../components/addGoods/index';
import PreviewActivity from '../../components/activity/activityPre';
import { uploadQiniu, checkImgType, authorization  } from 'utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const ActivityForm = Form.create()(
  class CreateForm extends Component {

    async beforeUpload(file) {
      const { changeImg } = this.props;
      const isJPG = checkImgType(file.type);
      if (!isJPG) {
        message.error('请上传正确格式图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片过大!');
      }
      if(isLt2M && isJPG){
        const formatData = new FormData();
        formatData.append('file', file);
        const resultData = await uploadQiniu(formatData, {
          width: 100,
          height: 100,
          originHeight: 150,
          originWidth: 150,
        })
        if (resultData) {
          changeImg(resultData[0])
        }
      }
      return false;
    }

    validatorShareImg(rules, value, callback) {
      const { templateInfo } = this.props;
      if (templateInfo.fileId) {
        callback()
      }else {
        callback('请上传分享图')
      }
    }

    // 特殊字符验证
    validatorName = (rule, value, callback) => {
      if (!value || /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
        callback()
      } else {
        callback('禁止输入特殊字符');
      }
    } 

    render() {
      const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 5 },
      }
      const { 
        form, 
        templateInfo, 
        tempModalState, 
        openTemDialog, 
        cancelTemDialog, 
        changeTemp, 
        changeActivityName,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form>
          <FormItem label="当前模板" {...formItemLayout}>
             <span>模板{templateInfo.id}</span>
             <a style={{ marginLeft: '10px' }} onClick={openTemDialog}>更换模板</a>
          </FormItem>
          <FormItem label="活动页面名称" {...formItemLayout}>
            {getFieldDecorator('title',{
              initialValue: templateInfo.title,
              rules: [{ required: true, message: '请输入活动名称' }, {
                validator: this.validatorName,
              }],
            })(
              <Input maxLength="30" onChange={changeActivityName} />
            )}
          </FormItem>
          <FormItem label="页面分享图" {...formItemLayout}>
          {
            getFieldDecorator('shareImg',{
              initialValue: [1],
              rules: [{ required: true, message: ' ' },{
                validator: this.validatorShareImg.bind(this)
              }],
            })(
              <Upload
                name="avatar"
                listType="picture-card"
                className={styles.avatarUploader}
                showUploadList={false}
                beforeUpload={this.beforeUpload.bind(this)}
              >
                {templateInfo.shareImg ? <img src={templateInfo.shareImg} style={{width: 100, height: 100}} alt="avatar" /> : <Button size="small">上传图片</Button>}
              </Upload>
            )
          }
          <p>推荐尺寸100px*100px</p>
          </FormItem>
          <FormItem label="活动页面分享" {...formItemLayout}>
          {
            getFieldDecorator('shareDecript', {
              initialValue: templateInfo.shareDecript,
            })(
              <TextArea maxLength="100" />
            )
          }
          <p>不超过100字</p>
          </FormItem>
          <Modal
            title = "选择模板"
            footer = {null}
            width = {600}
            visible = {tempModalState}
            onCancel={cancelTemDialog}
            maskClosable={false}
          >
            <ul className = "template-dialog">
              {
                [1, 2, 3].map((value) => {
                  return (
                    <li key={value}>
                      <img src={require('../../../../../assets/images/shop/activity-' + value + '.png')} alt="" />
                      <Button 
                        onClick={() => changeTemp(value)} 
                        type="primary" 
                        style={{ width: '100%', marginTop: 10}} 
                        disabled={templateInfo.id === value}>{templateInfo.id === value ? '使用中': '立即使用'}</Button>
                    </li>
                  )
                })
              }
            </ul>
          </Modal>
        </Form>
      )
    }
  }
)

const BackGroundItem = (props) => {
  const { tg, ind, data, delBgTem, changeBgImg, changeBgUrl } = props;
  
  async function beforeUpload (file) {
    const currentId = this.name.substr(1)
    const isJPG = checkImgType(file.type);
    if (!isJPG) {
      message.error('上传正确格式图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片过大!');
    }
    if(isLt2M && isJPG){
      const formatData = new FormData();
      formatData.append('file', file);
      const resultData = await uploadQiniu(formatData, {
        width: 375,
        height: 300,
        originHeight: 187,
        originWidth: 150,
      })
      if (resultData) {
        changeBgImg(resultData[0], parseInt(currentId))
      }
    }
    return false;
  }

  const _changeBgUrl = (res) => {
    const {value} = res.target;
    changeBgUrl(value, ind)
  }

  return (
    <div id={tg} className={styles.bgItem}>
      <div className={styles.colLine}>背景图片{ind + 1}</div>
      <div className={styles.colLine}>
        <Upload
          name={tg}
          className="activity-upload-bg"
          listType="picture-card"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          {data.pictureUrl ? <img src={data.pictureUrl} style={{width: 370, height: 250 }} alt="" /> : <Button size="small">上传</Button>}
        </Upload>
        </div>
        <div className = {styles.colLine}>
          <p>推荐尺寸：宽度750px，高度100px~667px</p>
          <Row>
            <Col span={4} style={{ lineHeight: '30px' }}>
              URL:
            </Col>
            <Col span={19}>
              <Input value={data.connect} onChange={_changeBgUrl} />
            </Col>
          </Row>
          <Row>
            <Button type="danger" onClick={()=> delBgTem(ind)}>删除</Button>
          </Row>
        </div>
    </div>
  )
}

const GoodsItem = (props) => {
  const { 
    tg, 
    ind, 
    data, 
    delGoodTem, 
    openGoodsPage, 
    delGoods, 
    changeGoodsListTitle, 
    autoGoods, 
    onAutoGoods, 
    groupOptions,
    defaultParams, 
    onChangeAutoGoodsStat,
    onChangeAutoGroup,
  } = props;

  const _delGoods = (goodsId,) => {
    delGoods(goodsId, ind)
  }

  const columns = [{
    title: '商品图片',
    render: (row) => { return <img style={{ width: 50, height: 50 }} src={row.goodsUrl} /> },
    width: 90,
  }, {
    title: '商品名称',
    dataIndex: 'goodsName',
    width: 120,
  }, {
    title: '商品分组',
    dataIndex: 'groupName',
    width: 120,
  }, {
    title: '商品价格',
    dataIndex: 'price',
    width: 100,
  }, {
    title: '库存',
    dataIndex: 'stock',
    width: 80,
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
    },
    width: 100,
  }, {
    title: '次序',
    dataIndex: 'goodsNumber',
    width: 120,
  }, {
    title: '云仓商品',
    width: 90,
    render: (row) => {
      return (
        <div>{row.inCloud === 1 ? '是' : '否'}</div>
      )
    },
  }, {
    title: '操作',
    render: (row, ind) => <Button size="small" type="primary" onClick={() => _delGoods(row.goodsId)}>删除</Button>
  }]

  const _changeGoodsListTitle = (res) => {
    const { value } = res.target;
    changeGoodsListTitle(value, ind)
  }
  const _onChangeAutoGoodsStat = (res) => {
    onChangeAutoGoodsStat(res, ind)
  }
  const _onChangeAutoGroup = (res) => {
    onChangeAutoGroup(res, ind)
  }

  return (
    <div id={tg} className={styles.goodItem}>
      <h3 style={{ marginBottom: '27px' }}>商品列表_{ind + 1}</h3>
      <Row>
        <Col span={2} style={{ lineHeight: '30px' }}>
          列表标题
        </Col>
        <Col span={5}>
          <Input defaultValue={data.listTitle} onChange={_changeGoodsListTitle} maxLength="16" />
        </Col>
        <Col span={17} style={{ textAlign: 'right' }}>
        {
          autoGoods ? <span style={{ marginRight: 10 }}>
            <span style={{ marginRight: 5 }}>*自动同步商品</span> 
            <Select style={{width: 100, marginRight: 5}} value={defaultParams.goodsStatus} onChange={_onChangeAutoGoodsStat}>
              <Option value={0}>全部</Option>
              <Option value={1}>待上架</Option>
              <Option value={2}>已上架</Option>
              <Option value={3}>已下架</Option>
              <Option value={4}>已售完</Option>
            </Select>
            {
               groupOptions.length === 0 ? null :
               <Select style={{width: 100, marginRight: 5}} value={defaultParams.groupId} onChange={_onChangeAutoGroup}>
               {
                 groupOptions.map((value) => {
                   return  <Option key={value.groupId} value={value.groupId}>{value.groupName}</Option>
                 })
               }
             </Select>
            }
            <Button size="small" type="primary" ghost onClick={() => onAutoGoods(ind)}>同步</Button>
          </span> : <span style={{ marginRight: 10 }}>
            <Button type="primary" ghost size="small" onClick={() => openGoodsPage(ind)}>添加商品</Button>
          </span>
        }
        <Button type="danger" size="small" onClick={() =>  delGoodTem(ind)}>删除模块</Button>
        </Col>
      </Row>
      <Row>
        <div className={styles.tableTitle}>商品列表</div>
        <Table columns={columns} dataSource={data.goodsList} pagination={false} scroll={{ y: 300 }} />
      </Row>
    </div>
  )
}

class ActivityDetails extends Component {
  constructor(props){
    super(props);
    this.state= {
      currentSelect: '', // 当前选择的锚
      modalState: false, // 新建模块-dialog
      tempModalState: false, // 更换模板-dislog
      addGoodsPage: false, // 页面状态
      previewPageStat: false, // 预览页面状态
      filterGoods: [], // 过滤已存在商品
      targetGoodsListId: 0, 
      templateInfo: {
        id: 1,
        title: '',
        shareImg: '',
        fileId: 0,
        shareDecript: '',
        activityList: [{
          pictureUrl: '',
          pictureId: 0,
          connect: '',
        }],
        goodsList: [{
          listTitle: '',
          goodsList: []
        }]
      }
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    const activityId = this.props.match.params.index;
    if (activityId !== 'new'){
      activityDetail({
        activityId: activityId,
        shopId: userInfo.shopId
      }).then((res) => {
        if(res.status === 0){
          const result = res.body.goodsList[0]
          for (let i = 0; i < result.groupList.length; i++) {
            if (!result.groupList[i].goodsList) {
              result.groupList[i].goodsList = []
            }
          }
          const orderData = {
            id: result.stencilId,
            title: result.activityName,
            shareImg: result.fileUrl,
            shareDecript: result.shareContent,
            activityList: result.activityList === null ? [] : result.activityList,
            goodsList: result.groupList === null ? [] : result.groupList, 
            fileId: result.fileId,
          }
          this.setState({
            templateInfo: orderData,
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    } else {
      this.setState({
        tempModalState: true,
      })
    }
    dispatch({ type: 'shopModel/listShopGroupName', payload: {shopId: userInfo.shopId } })
  }

  goBack() {
    router.goBack();
  }

  _submit() {
    this.formRef.validateFields((err, value) => {
      if (err) {
        return 
      } else {
        let _status = false;
        const { templateInfo } = this.state;
        const activityId = this.props.match.params.index;
        const userInfo = authorization.getUserInfo();
        console.log(templateInfo)
        const fileLists = templateInfo.activityList.reduce((_bg, value) => ([
          ..._bg, {
            fileId: value.pictureId,
            fileUrl: value.connect.indexOf('&') > -1 ? value.connect.replace('&', '%26') : value.connect,
          }
        ]), [])
        let goodsLists = templateInfo.goodsList.reduce((_list, goods) => ([
          ..._list, {
            title: goods.listTitle,
            goodsList: goods.goodsList,
          }
        ]),[])
        goodsLists.forEach((value, _index) => {
          if (value.title.length < 2 || value.title.length > 16) {
            _status = 'g' + _index;
            document.getElementById(_status).scrollIntoView({behavior: 'smooth'}); 
            console.log(_status)
            message.error('请输入2~16字的标题')
            return;
          }
          if (value.goodsList !== null) {
            value.goodsList = value.goodsList.reduce((_list, goods) => ([
              ..._list, {
                goodsId: goods.goodsId,
                goodsNumber: goods.goodsNumber,
              }
            ]), [])
          } else {
            value.goodsList = []
          }
        })
        if (!_status) {
          const formData = {
            activityId: activityId === 'new' ? 0 : activityId,
            activityName: value.title,
            shareFileId: templateInfo.fileId,
            shopId: userInfo.shopId,
            content: value.shareDecript,
            templateId: templateInfo.id,
            fileLists: JSON.stringify(fileLists),
            goodsLists: JSON.stringify(goodsLists),
          }
          activityUpAndInsert(formData).then((res) => {
            if (res.status === 0){
              message.success('保存成功')
              router.goBack()
            } else {
              message.error(res.msg)
            }
          })
        }
      }
    })
  }
  
  // 预览
  _preview() {
    this.setState({
      previewPageStat: true,
    })
  }

  // 关闭预览
  canclePreview() {
    this.setState({
      previewPageStat: false,
    })
  }

  _closeModal() {
    this.setState({
      modalState: false,
    })
  }
  
  _addNewTemplate = (id) => {
    let bufferData = this.state.templateInfo;
    switch(id) {
      case 1:
        bufferData.activityList.push({ 
          pictureUrl: '',
          pictureId: 0,
          connect: '',
        });
        break;
      case 2:
        const { groupOptions } = this.props.shopModel;
        bufferData.goodsList.push({
          listTitle: '',
          goodsList: [],
          auto: true,
          defaultParams: {
            groupId: groupOptions[0] ? groupOptions[0].groupId : 0,
            goodsStatus: 0,
          }
        });
        break;
      case 3:
        bufferData.goodsList.push({
          listTitle: '',
          goodsList: []
        });
        break;
      default:
        break; 
    }
    this.setState({
      templateInfo: bufferData,
      modalState: false,
    })
  }

  scrollToAnchor = (anchorName) => {
    if (anchorName) {
      this.setState({
        currentSelect: anchorName,
      })
      if (anchorName === 'new') {
        this.setState({
          modalState: true,
        })
      } else {
        let anchorElement = document.getElementById(anchorName);
        if(anchorElement) { 
          anchorElement.scrollIntoView({behavior: 'smooth'}); 
        }
      }
    }
  }

  // 删除列表
  _delBgTem = (ind) => {
    let bufferData = this.state.templateInfo;
    if (typeof(ind) === 'number') {
      bufferData.activityList.splice(ind, 1);
      this.setState({
        templateInfo: bufferData,
      })
    }
  }  

  // 删除商品
  _delGoodsTem = (ind) => {
    let bufferData = this.state.templateInfo;
    if (typeof(ind) === 'number') {
      bufferData.goodsList.splice(ind, 1);
      this.setState({
        templateInfo: bufferData,
      })
    }
  }

  changeShareImg(res) {
    if(res){
      const { templateInfo } = this.state;
      templateInfo.shareImg = res.hostUrl + res.fileUrl;
      templateInfo.fileId = res.fileId;
      this.setState({
        templateInfo: {...templateInfo}
      }) 
    }
  }

  changeBgImg(res, id) {
    if(res) {
      const { templateInfo } = this.state;
      templateInfo.activityList[id].pictureUrl = res.hostUrl + res.fileUrl;
      templateInfo.activityList[id].pictureId = res.fileId;
      this.setState({
        templateInfo: {...templateInfo}
      }) 
    }
  }

  // 修改模板
  changeTemp(res) {
    const { templateInfo } = this.state;
    templateInfo.id = res;
    this.setState({
      templateInfo: {...templateInfo},
      tempModalState: false,
    })
  }

  openTemDialog = () => {
    this.setState({
      tempModalState: true,
    })
  }
  
  cancelTemDialog = () => {
    this.setState({
      tempModalState: false,
    })
  }

  // 确认添加商品-返回
  addGoodsList(res) {
    if(res){
      const formatData = res.reduce((_orderData, value) => ([..._orderData, {
        goodsId: value.goodsId,
        goodsName: value.goodsName ,
        goodsUrl: value.imgHostUrl + value.imgZoomUrl,
        groupName: value.groupName,
        inCloud: value.inCloud,
        goodsNumber: value.goodsNumber,
        price: value.price,
        stock: value.stock,
        status: value.status,
      }]), [])
      const { templateInfo, targetGoodsListId } = this.state;
      templateInfo.goodsList[targetGoodsListId].goodsList = [...templateInfo.goodsList[targetGoodsListId].goodsList, ...formatData]
      this.setState({
        templateInfo: {...templateInfo},
      })
    }
  }

  // 打开添加商品页面
  openGoodsPage(id) {
    if(typeof id === 'number'){
      const { templateInfo } = this.state;
      this.setState({
        filterGoods: templateInfo.goodsList[id].goodsList === null ? [] : templateInfo.goodsList[id].goodsList,
        addGoodsPage: true,
        targetGoodsListId: id,
      })
    }
  }

  // 关闭添加商品页面
  cancelGoodsPage() {
    this.setState({
      addGoodsPage: false,
    })
  }

  // 删除商品
  delGoods(goodsId, _index) {
    const { templateInfo } = this.state;
    templateInfo.goodsList[_index].goodsList.forEach((goods, key) => {
      if (goods.goodsId === goodsId) {
        templateInfo.goodsList[_index].goodsList.splice(key, 1)
      }
    })
    this.setState({
      templateInfo: {...templateInfo},
    })
  }


  // 修改BgUrl
  changeBgUrl(url, id) {
    const { templateInfo } = this.state;
    templateInfo.activityList[id].connect = url;
    this.setState({
      templateInfo: {...templateInfo},
    })
  }

  //changeActivityName
  changeActivityName(res) {
    const { value } = res.target;
    const { templateInfo } = this.state;
    templateInfo.title = value;
    this.setState({
      templateInfo: {...templateInfo},
    })
  }

  // 修改商品列表TITLE
  changeGoodsListTitle(title, id) {
    const { templateInfo } = this.state;
    templateInfo.goodsList[id].listTitle = title;
    this.setState({
      templateInfo: {...templateInfo},
    })
  }

  // 修改自动同步 商品状态
  onChangeAutoGoodsStat(res, ind) {
    const { templateInfo } = this.state;
    templateInfo.goodsList[ind].defaultParams.goodsStatus = res;
    this.setState({
      templateInfo: {...templateInfo}
    })
  }

  // 修改自动同步-分组
  onChangeAutoGroup(res, ind) {
    const { templateInfo } = this.state;
    templateInfo.goodsList[ind].defaultParams.groupId = res;
    this.setState({
      templateInfo: {...templateInfo}
    })
  }

  // 自动同步商品
  onAutoGoods(ind) {
    const { templateInfo } = this.state;
    const { groupId, goodsStatus } = templateInfo.goodsList[ind].defaultParams;
    const userInfo = authorization.getUserInfo();
    getlistShopGroup({
      groupId: groupId,
      status: goodsStatus,
      shopId: userInfo.shopId,
    }).then((result) => {
      if(result.status === 0) {
        const filterGoods = result.body.shopListGroupInfo.reduce((_orderData, value) => ([..._orderData, {
          goodsId: value.goodsId,
          goodsName: value.goodsName ,
          goodsUrl: value.imgHostUrl + value.zoomUrl,
          groupName: value.groupName,
          inCloud: value.inCloud,
          goodsNumber: value.goodsNumber,
          price: value.price,
          stock: value.stock,
          status: value.status,
        }]), [])
        templateInfo.goodsList[ind].goodsList = [...templateInfo.goodsList[ind].goodsList, ...filterGoods]
        this.setState({
          templateInfo: {...templateInfo}
        })
        message.success('同步成功');
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {
    const { 
      templateInfo, 
      currentSelect, 
      modalState, 
      tempModalState, 
      addGoodsPage,
      filterGoods,
      previewPageStat,
    } = this.state;
    const { groupOptions } = this.props.shopModel;
    const { activityList, goodsList } = templateInfo;
    return (
    <div>
      <div className={styles.container} style={{ display: (addGoodsPage || previewPageStat) ? 'none' : 'block' }}>
        <BlockHead 
          leftText="编辑活动" 
          goBackBt={this.goBack} 
          previewBt={this._preview.bind(this)} 
          savetBt={ {event: this._submit.bind(this), text: '保存并提交'} } 
        />
        <div className={styles.content}>
          <Row>
            <Col span={24}>
              <ActivityForm 
                templateInfo={templateInfo}
                tempModalState={tempModalState}
                openTemDialog={this.openTemDialog}
                cancelTemDialog={this.cancelTemDialog}
                changeImg={this.changeShareImg.bind(this)}
                changeTemp={this.changeTemp.bind(this)}
                changeActivityName={this.changeActivityName.bind(this)}
                ref={(form) => this.formRef = form}
              />
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <div className={styles.leftMenu}>
                <ul>
                  {activityList.map((e, i) => { 
                    let tg = 'b' + i;
                    return (
                      <li 
                        key={tg} 
                        onClick={()=> this.scrollToAnchor(tg)} 
                        className={currentSelect === tg ? styles.active : null}>背景图片{i+1}
                      </li>)
                  })}
                  {goodsList.map((e, i) => {
                    let tg = 'g' + i;
                    return (
                      <li 
                        key={tg}  
                        onClick={()=> this.scrollToAnchor(tg)} 
                        className={currentSelect === tg ? styles.active : null}>商品列表{i+1}
                      </li>
                    )
                  })}
                  <li 
                    onClick={()=> this.scrollToAnchor('new')} 
                    className={currentSelect === 'new' ? styles.active : null}
                  >新建模块</li> 
                </ul>
              </div>
            </Col>
            <Col span={21}>
              <div className={styles.rightBlock}>
                {activityList.map((e, i) => {
                  let tg = 'b' + i;
                  return (
                    <BackGroundItem 
                      key={tg}
                      tg={tg} 
                      data={activityList[i]} 
                      ind={i} 
                      delBgTem={(ind) => this._delBgTem(ind)} 
                      changeBgImg={this.changeBgImg.bind(this)}
                      changeBgUrl={this.changeBgUrl.bind(this)}
                    />
                  )
                })}
                {goodsList.map((e, i) => {
                  let tg = 'g' + i;
                  return (
                    <GoodsItem 
                      key={tg}
                      tg={tg} 
                      ind={i} 
                      data={goodsList[i]} 
                      delGoodTem={(ind) => this._delGoodsTem(ind)} 
                      delGoods={this.delGoods.bind(this)}
                      openGoodsPage={this.openGoodsPage.bind(this)}
                      changeGoodsListTitle={this.changeGoodsListTitle.bind(this)}
                      autoGoods={e['auto']}
                      groupOptions={groupOptions}
                      defaultParams={goodsList[i]['defaultParams']}
                      onChangeAutoGoodsStat={this.onChangeAutoGoodsStat.bind(this)}
                      onChangeAutoGroup={this.onChangeAutoGroup.bind(this)}
                      onAutoGoods={this.onAutoGoods.bind(this)}
                    />
                  )
                })}
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          title = "新建模板"
          footer = {null}
          width = {300}
          visible = {modalState}
          onCancel = {this._closeModal.bind(this)}
        >
          <p><Button type="primary" onClick={() => this._addNewTemplate(1)}>添加背景图片</Button></p>
          <p style={{ marginTop: '10px'  }}><Button type="primary" onClick={() => this._addNewTemplate(2)}>自动同步商品</Button></p>
          <p style={{ marginTop: '10px'  }}><Button type="primary" onClick={() => this._addNewTemplate(3)}>手动添加商品</Button></p>
        </Modal>
      </div>
      {  
        addGoodsPage ? <AddGoods filterGoods={filterGoods} addGoodsList={this.addGoodsList.bind(this)} goBack={this.cancelGoodsPage.bind(this)} /> : null
      }
      { previewPageStat && <PreviewActivity data={templateInfo} canclePreview={this.canclePreview.bind(this)} /> }
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { shopModel: state.shopModel }
}

export default connect(mapStateToProps)(ActivityDetails);
