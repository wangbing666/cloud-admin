/**
 * Created by fantt on 2018/6/11.
 * 新增或编辑活动
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Spin,
  Modal,
  message
} from 'antd';
import router from 'umi/router';

import ActivityInfo from '../components/activity-edit/activityInfo';
import ActivityGoods from '../components/activity-edit/activityGoods';
import ActivityBill from '../components/activity-edit/activityBill';

import styles from './index.less';

class ActivityEdit extends Component {

  constructor(props) {
    super(props);

    /*
    * visible 模态框显示与隐藏
    * confirmLoading 点击模态框确定后请求loading
    * activityId 活动ID，为0时表示新增活动，其他任意数字表示修改
    * title 新增或者编辑文字
    * id 新增或者编辑的ID
    */
    this.state = {
      confirmLoading: false,
      id: this.props.match.params.index,
      activityId: this.props.match.params.index,
      title: this.props.match.params.index === '0' ? '新建' : '编辑',
      modalTitle: '',
      operationText: "",
      content: '',
      status: '',
      visible: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { activityId } = this.state;
    if (this.state.activityId === '0') {
      dispatch({
        type: 'activityDetailModel/setActivityDetail',
        payload: {
          ActivityDetail: {
            groupActivityBuy: {},
            groupGoods: [],
          }
        },
      });
      dispatch({
        type: 'activityDetailModel/setSelectGoodsList',
        payload: {
          selectGoodsList: [],
        },
      });
    } else {
      //获取详情
      dispatch({
        type: 'activityDetailModel/ActivityDetail',
        payload: {
          activityId: activityId
        },
      });
    }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ // 组件销毁置空选择的商品
      type: 'activityDetailModel/setSelectGoodsId',
      payload: {
        selectGoodsId: [],
      },
    });
  }

  // 格式化数据
  getFormat = () => {
    const { selectGoodsList } = this.props.activityDetailModel;
    // 循环选择的数据，变为后端需要的数据格式
    let list = [];
    let data = {}

    for (let i = 0; i < selectGoodsList.length; i++) {
      let params = [], groupMoney = [];
      if (selectGoodsList[i].specicationInfo && selectGoodsList[i].specicationInfo.length !== 0) {
        for (let j = 0; j < selectGoodsList[i].specicationInfo.length; j++) {
          params.push(selectGoodsList[i].specicationInfo[j].specicationPriceId);
          groupMoney.push(selectGoodsList[i].specicationInfo[j].groupPrice);
        }
      }
      list.push({ groupGoodsId: selectGoodsList[i].goodsId, params: params, groupMoney: groupMoney, groupBuys: selectGoodsList[i].groupBuys })
    }
    console.log(list)
    for (let i = 0; i < list.length; i++) {
      if (!list[i].groupBuys || !list[i].groupMoney) {
        message.error('请将信息填写完全');
        return;
      }
      if (list[i].groupBuys == 0 || list[i].groupBuys == 1) {
        message.error('团购人数必须大于或等于两人');
        return;
      }
      if (list[i].params.length !== 0 && list[i].groupMoney.length !== 0) {
        list[i].params = list[i].params.join(',');
        list[i].groupMoney = list[i].groupMoney.join(',');
      }
      Object.keys(list[i]).forEach(key =>
        data[`goodsList[${i}][${key}]`] = list[i][key]
      )
    }
    return data;
  }

  // 保存为草稿
  onSaveDraft = () => {
    const { dispatch, activityDetailModel } = this.props;
    const { id } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (fieldsValue['startTimeString'] && fieldsValue['endTimeString']) {
          let startTime = fieldsValue['startTimeString'].unix(Number),
            endTime = fieldsValue['endTimeString'].unix(Number);
          if (startTime < endTime) { // 判断开始时间小于结束时间
            const values = {
              ...fieldsValue,
              'startTimeString': fieldsValue['startTimeString'].format('YYYY-MM-DD HH:mm:ss'),
              'endTimeString': fieldsValue['endTimeString'].format('YYYY-MM-DD HH:mm:ss'),
            };
            const data = this.getFormat();
            values.type = 0; // 未知字段
            values.saveType = 0; // 1代表保存并发布
            values.enterpriseId = activityDetailModel.enterpriseId; // 企业ID
            values.shopId = activityDetailModel.shopId; // 企业店铺ID
            values.groupBuyId = id; // 活动ID，新增活动为0
            if (data) {
              dispatch({
                type: 'activityDetailModel/AddActivity',
                payload: {
                  data: values,
                  table: data,
                },
              });
            }
          } else {
            message.error('活动结束时间要大于开始时间')
          }
        }
      }
    });
  }

  // 保存并发布
  onSaveIssue = () => {
    const { dispatch, activityDetailModel } = this.props;
    const { id } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (fieldsValue['startTimeString'] && fieldsValue['endTimeString']) {
          let startTime = fieldsValue['startTimeString'].unix(Number),
            endTime = fieldsValue['endTimeString'].unix(Number);
          if (startTime < endTime) { // 判断开始时间小于结束时间
            const values = {
              ...fieldsValue,
              'startTimeString': fieldsValue['startTimeString'].format('YYYY-MM-DD HH:mm:ss'),
              'endTimeString': fieldsValue['endTimeString'].format('YYYY-MM-DD HH:mm:ss'),
            };
            const data = this.getFormat();

            values.type = 0; // 未知字段
            values.saveType = 1; // 1代表保存并发布
            values.enterpriseId = activityDetailModel.enterpriseId; // 企业ID
            values.shopId = activityDetailModel.shopId; // 企业店铺ID
            values.groupBuyId = id; // 活动ID，新增活动为0
            if (data) {
              dispatch({
                type: 'activityDetailModel/AddActivity',
                payload: {
                  data: values,
                  table: data,
                },
              });
            }
          } else {
            message.error('活动结束时间要大于开始时间')
          }
        }
      }
    });
  }

  // 取消发布
  cancelActivity = () => {
    this.setState({
      visible: true,
      modalTitle: '取消发布',
      content: '是否取消发布该活动？',
      operationText: '确认取消',
      status: 3,
    });
  }

  // 删除活动
  onDelActivity = () => {
    this.setState({
      visible: true,
      modalTitle: '确认删除',
      content: '是否确认删除该活动？',
      operationText: '确认删除',
      status: 2,
    });
  }


  // 取消操作
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  // 确认操作
  handleDelOk = (e) => {
    const { status, activityId } = this.state;
    const { dispatch, activityDetailModel } = this.props;
    if (status == 1) { // 发布活动
      dispatch({
        type: 'activityDetailModel/ReleaseActivity',
        payload: {
          shopId: activityDetailModel.shopId,
          groupBuyId: activityId,
          isStatus: status,
        }
      })
        .then(() => {
          this.setState({
            visible: false,
          });
        })
    }
    if (status == 2) { // 删除活动
      dispatch({
        type: 'activityDetailModel/DeleteActivity',
        payload: {
          shopId: activityDetailModel.shopId,
          groupBuyId: activityId,
        }
      })
        .then(() => {
          this.setState({
            visible: false,
          });
        })
    }
    if (status == 3) { // 取消活动
      dispatch({
        type: 'activityDetailModel/CancelActivity',
        payload: {
          groupBuyActivityId: activityId,
        }
      })
        .then(() => {
          this.setState({
            visible: false,
          });
        })
    }
  }

  render() {
    const { activityDetailModel, form } = this.props
    const { visible, confirmLoading, activityId, modalTitle, operationText, content } = this.state
    const { ActivityDetail, showListLoadding } = activityDetailModel
    const { groupActivityBuy } = ActivityDetail;
    const ActivityStatus = (props) => {
      const { isStatus } = props;
      if (isStatus && isStatus == 0) {
        return <span>未发布</span>
      }
      if (isStatus && isStatus == 1) {
        return <span>等待开始</span>
      }
      if (isStatus && isStatus == 2) {
        return <span>活动进行中</span>
      }
      if (isStatus && isStatus == 3) {
        return <span>活动结束</span>
      }
      return <span>未发布</span>;
    }
    return (
      <div className={styles.activityEdit}>
        <Form onSubmit={this.handleSubmit}>
          <div className={styles.activityBody}>
            <Spin size="large" spinning={showListLoadding}>
              <div className={styles.cloudHead}>
                <div className={styles.cloudHeadLeft}>
                  <span>{this.state.title}团购</span>
                </div>
                <div className={styles.cloudHeadLeft}>
                  <ActivityStatus {...groupActivityBuy} />
                </div>
                <div className={styles.cloudHeadRight}>
                  <div className="row" style={{ display: 'inline-block' }}>
                    <Button type="primary" ghost onClick={() => { router.go(-1) }}>返回</Button>
                  </div>
                  {groupActivityBuy.isStatus == 3 || groupActivityBuy.isStatus == 0 ? <Button type="primary" ghost onClick={this.onDelActivity}>删除活动</Button> : null}
                  {groupActivityBuy.isStatus == 0 || activityId == 0 ? <Button type="primary" ghost htmlType="submit" onClick={this.onSaveDraft}>保存为草稿</Button> : null}
                  {groupActivityBuy.isStatus == 1 || groupActivityBuy.isStatus == 2 ? <Button type="primary" ghost htmlType="submit" onClick={this.cancelActivity}>取消发布</Button> : null}
                  {groupActivityBuy.isStatus !== 3 || activityId == 0 ? <Button type="primary" ghost htmlType="submit" onClick={this.onSaveIssue}>保存并发布</Button> : null}
                </div>
              </div>
              <div className={styles.activity_edit}>
                <ActivityInfo form={form} formData={groupActivityBuy} />
                <ActivityGoods form={form} formData={groupActivityBuy} id={this.state.id} />
                <ActivityBill form={form} id={this.state.activityId} />
              </div>
            </Spin>
          </div>
        </Form>
        <Modal title={modalTitle}
          visible={visible}
          onOk={this.handleDelOk}
          okText={operationText}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{content}</p>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { activityDetailModel: state.activityDetailModel };
};

const activityEditForm = Form.create()(ActivityEdit);

export default connect(mapStateToProps)(activityEditForm)
