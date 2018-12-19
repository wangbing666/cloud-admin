import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Table,
  DatePicker,
  Spin,
  Divider,
  Modal,
} from 'antd';

import styles from '../../activity-edit/index.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const columns = [{
  title: '团购流水',
  dataIndex: 'groupFlowNo',
  key: 'groupFlowNo',
}, {
  title: '商品名称',
  dataIndex: 'goodName',
  key: 'goodName',
}, {
  title: '分销者微度ID',
  dataIndex: 'wedoUserId',
  key: 'wedoUserId',
}, {
  title: '创建时间',
  dataIndex: 'createTimeString',
  key: 'createTimeString',
}, {
  title: '当前组团人数',
  dataIndex: 'nowPersons',
  key: 'nowPersons',
}, {
  title: '当前状态',
  dataIndex: 'status',
  key: 'status',
  render: (text, row) => {
    if (text == 0) {
      return '组团成功'
    }
    if (text == 1) {
      return '组团失败'
    }
    if (text == 2) {
      return '进行中'
    }
  },
}];

class ActivityBill extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      visible: false,
    }
    this.tableColumn = columns.concat({
      title: '订单号',
      dataIndex: 'edit',
      key: 'edit',
      width: '10%',
      render: (text, record) => {
        return (
          <div>
            <a href="javascript:;" onClick={() => this.onShowActivity(record.groupFlowId)}>查看</a>
          </div>
        );
      }
    })
  }

  componentDidMount() {
    this.initList("", "");
  }

  // 列表初始化
  initList = (startTime, endTime) => {
    const { dispatch, activityDetailModel } = this.props;
    this.setState({
      loading: true,
    })
    dispatch({
      type: 'activityDetailModel/ActivityWater',
      payload: {
        startTime: startTime,
        endTime: endTime,
        pageSize: 10,
        pageNow: 1,
        enterpriseId: activityDetailModel.enterpriseId,
        groupBuyId: this.props.id,
        shopId: activityDetailModel.shopId,
      }
    })
      .then(() => {
        this.setState({
          loading: false,
        })
      });
  }

  onChange = (date, dateString) => {
    if (dateString && dateString.length == 2) {
      this.initList(dateString[0], dateString[1]);
    }
  }

  // 查看订单列表
  onShowActivity = (id) => {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
    });
    dispatch({
      type: 'activityDetailModel/GroupFlowOrder',
      payload: {
        groupFlowId: id,
      }
    })
  }

  // 关闭模态框
  handleOk = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { actiList, acOrderList } = this.props.activityDetailModel;
    const { loading } = this.state;
    return (
      <div className={styles.info_edit}>
        <div className={styles.activity_title}>
          <label>活动流水</label>
          <div className={styles.date}>
            <RangePicker onChange={this.onChange} />
          </div>
        </div>
        <Spin size="large" spinning={loading}>
          <Table columns={this.tableColumn}
            dataSource={actiList}
            pagination={false}
            rowKey={(r, i) => i}
            className={styles.goods_table}
          />
        </Spin>
        <Modal
          title="团购订单"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
        >
          {acOrderList.map((item, index) => {
            return <p>{item.orderNo}</p>
          })}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { activityDetailModel: state.activityDetailModel };
};

export default connect(mapStateToProps)(ActivityBill)
