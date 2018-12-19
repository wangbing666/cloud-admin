import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Upload, Checkbox, message, Select } from 'antd';
import styles from '../index.less';
import router from 'umi/router';
import { connect } from 'dva';
import { groupGoodsList, getGroupInfo, addfile } from '../api/index';
import { uploadQiniu, authorization } from "utils";

const FormItem = Form.Item;
const Option = Select.Option;

const GroupForm = Form.create()(
  (props) => {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const { form, data, changeImg } = props;
    const { anotherName, name, goodsList, bannerList } = data;
    const { getFieldDecorator } = form;

    function beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' ||  file.type === 'image/png';
      if (!isJPG) {
        message.error('请上传正确格式图片!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片不能超过 5MB!');
      }
      if (isJPG && isLt5M) {
        const formData = new FormData()
        formData.append('file', file, 'file')
        uploadQiniu(formData,  {
          width: 100,
          height: 100,
          originWidth: 150,
          originHeight: 150,
        }).then((res) => {
          if(res) {
            const index = parseInt(this.name.split('-')[1])
            changeImg(res[0], index)
          }
        })
      }
      return false;
    }

    const _changeIsLink = (res) => {
      const { changeIsLink } = props;
      const { checked, onlyId } = res.target;
      const _indexId = parseInt(onlyId.split('-')[1])
      changeIsLink(checked, _indexId)
    }

    const _selectGoods = (res) => {
      if(res) {
        const { selectGoods } = props;
        const goodsId = res.split('-')[0]
        const _index = parseInt(res.split('-')[1])
        selectGoods(goodsId, _index)
      }
    }

    const _changeOutLink = (res) => {
      const { changeOutLink } = props;
      let { value, id } = res.target;
      id = parseInt(id.split('Y')[1])
      changeOutLink(value, id)
    }

    return (
      <Row type="flex" justify="center">
      <Form className={styles.groupForm}>
        <FormItem label="分组名称" {...formItemLayout}>
          <Row>
            <Col span={16}>
            {
              getFieldDecorator('name', {
                initialValue: name,
                rules: [{
                  required: true, message: '分组名称',
                }]
              })(
                <Input maxLength="10" />
              )
            }
            </Col>
          </Row>
        </FormItem>
        <FormItem label="分组别名" {...formItemLayout}>
          <Row>
            <Col span={16}>
            {
              getFieldDecorator('anotherName', {
                initialValue: anotherName,
              })(
                <Input />
              )
            }
            </Col>
          </Row>
          <p>上传图片尺寸：W:750px * H:586px,图像大小不超过5M</p>
        </FormItem>
        <FormItem label="Banner图集" {...formItemLayout}>
        {
          bannerList.map((item, key) => {
            const imageUrl = item.hostUrl + item.fileUrl;
            return (
              <Row key={'bannerItem' + key}>
                <Col span={6}>
                  <Upload
                    name={ 'banner-'+key }
                    listType="picture-card"
                    className={styles.smallUploader}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                  >
                    {imageUrl ? <img src={imageUrl} style={{ width: 100, height: 100 }} alt="avatar" /> : <Button size="small">上传</Button>}
                  </Upload>
                </Col>
                <Col span={10}>
                  {
                    item.isOutreach === 1 ? <Input defaultValue={item.outtreachUrl} id={'onlaY'+key} onChange={_changeOutLink} /> : <Select value={item.goodsId + '-' + key} onChange={_selectGoods}>
                      <Option value={'0-'+key} disabled={true}>请选择商品</Option>
                      {
                        goodsList.map((item) => {
                          return <Option key={item.goodsId} value={item.goodsId + '-' + key}>{item.goodsName}</Option>
                        })
                      }
                    </Select>
                  }
                  <p>*不填写链接或不选择商品则不显示该Banner</p>
                </Col>
                <Col offset={1} span={6}>
                  <Checkbox 
                    onlyId={'checkbox-'+key}
                    checked={item.isOutreach === 1 ? true : false} 
                    onChange={_changeIsLink}>作为外链</Checkbox>
                </Col>
              </Row>
            )
          })
        }
        </FormItem>
      </Form>
      </Row>
    )
  }
)

class EditGroup extends Component {
  constructor(props) {
    super(props)
    this.state= {
      anotherName: '',
      name: '',
      groupId: 0,
      goodsList: [],
      bannerList: [
        {
          bannerId: 0,
          isOutreach: 0,
          fileId: 0,
          fileUrl: '',
          goodsId: 0,
          hostUrl: '',
          outtreachUrl: '',
        },
        {
          bannerId: 0,
          isOutreach: 0,
          fileId: 0,
          fileUrl: '',
          goodsId: 0,
          hostUrl: '',
          outtreachUrl: '',
        },
        {
          bannerId: 0,
          isOutreach: 0,
          fileId: 0,
          fileUrl: '',
          goodsId: 0,
          hostUrl: '',
          outtreachUrl: '',
        },
      ]
    }
  }

  // 是否为外链
  changeIsLink(checked, index) {
    const { bannerList } = this.state;
    bannerList[index].isOutreach = checked ? 1 : 0;
    this.setState({
      bannerList: [...bannerList],
    })
  }
  
  // 选择关联商品
  selectGoods(goodsId, index) {
    const { bannerList } = this.state;
    bannerList[index].goodsId = goodsId;
    this.setState({
      bannerList: [...bannerList]
    })
  }

  // 修改外链
  changeOutLink(value, index) {
    const { bannerList } = this.state;
    bannerList[index].outtreachUrl = value;
    this.setState({
      bannerList: [...bannerList],
    })
  }

  // 提交保存 
  _submit() {
    this.formRef.validateFields((err, values) => {
      if (!err) {
        let { bannerList, groupId } = this.state;
        const userInfo = authorization.getUserInfo();
        bannerList = bannerList.filter((item) => {return item.fileId !== 0})
        bannerList = bannerList.reduce((_banner, item) => ([..._banner, {
          bannerId: item.bannerId === 0 ? undefined : item.bannerId,
          isOutreach: item.isOutreach,
          fileId: item.fileId,
          goodsId: item.goodsId,
          outtreachUrl: item.outtreachUrl,
        }]),[])
        const orderData = {
          ...values,
          groupId: groupId,
          shopId: userInfo.shopId,
          userId: userInfo.userId,
          type: groupId === 0 ? 1 :  2,
          bannerList: JSON.stringify(bannerList),
        }
        console.log(orderData)
        addfile(orderData).then((res) => {
          if (res.status === 0) {
            message.success('保存成功')
            router.goBack();
          }else {
            message.error(res.msg)
          }
        }).catch((err) => {})
      }
    });
  }
  
  // 更换图片 
  changeImg(res, index) {
    if (res) {
      const { bannerList } = this.state;
      bannerList[index].fileId = res.fileId;
      bannerList[index].fileUrl = res.fileUrl;
      bannerList[index].hostUrl = res.hostUrl;
      this.setState({
        bannerList: [...bannerList],
      })
    }
  }

  componentDidMount() {
    const { groupId } = router.location.query;
    const userInfo = authorization.getUserInfo();
    if (groupId) {
      groupGoodsList({groupId: groupId}).then(res => {
        if(res.status === 0) {
          this.setState({
            goodsList: res.body.goodsList,
            groupId: groupId,
          })
        }
      }).catch(err => {
      })
      getGroupInfo({userId: userInfo.userId, groupId: groupId}).then(res => {
        if(res.status === 0) {
          const resBanner = res.body.bannerList;
          if (resBanner[0] == null){
            this.setState({
              anotherName: res.body.anotherName,
              name: res.body.name,
            })
          }else {

            const bannerNum = resBanner.length - 1;
            let { bannerList } = this.state;
            for(let i = 0; i <= bannerNum; i++){
              bannerList[i] = {
                bannerId: resBanner[i].bannerId,
                isOutreach: resBanner[i].chooseType,
                fileId: resBanner[i].fileId,
                fileUrl: resBanner[i].fileUrl,
                goodsId: resBanner[i].goodsId,
                hostUrl: resBanner[i].hostUrl,
                outtreachUrl: resBanner[i].outsideUrl,
              }
            }
            this.setState({
              anotherName: res.body.anotherName,
              name: res.body.name,
              bannerList: [...bannerList]
            })
          }
        }
      }).catch(err => {
      })
    }
  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.blockHead}>
          <div className={styles.blockHeadLeft}>
            <span>编辑</span>
          </div>
          <div className={styles.blockHeadRight}>
            <Button onClick={()=>{router.goBack()}} style={{ marginRight: '10px' }}>返回</Button>
            <Button type="primary" onClick={this._submit.bind(this)}>保存</Button>
          </div>
        </div>
        <GroupForm
          data={this.state}
          changeIsLink={this.changeIsLink.bind(this)}
          selectGoods={this.selectGoods.bind(this)}
          changeOutLink={this.changeOutLink.bind(this)}
          changeImg={this.changeImg.bind(this)}
          ref={(form) => this.formRef = form }
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { groupModel: state.groupModel }
}

export default connect(mapStateToProps)(EditGroup);
