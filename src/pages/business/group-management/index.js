import React, { Component } from 'react';
import router from 'umi/router';
import { Button, Row, Col, Input, Table, Form, Pagination, DatePicker, Select, message, Modal } from 'antd';
import styles from './index.less';
import moment from 'moment';
import { connect } from 'dva';
import { updatenumber, deleteGroup } from './api/index';
import { authorization } from 'utils';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const sortKey = []

for (let i = 1; i < 11; i++) {
  sortKey.push(i)
}

const SearchForm = Form.create()(
  (props) => {
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 }
    }
    const { changeTime, onSearch, form, searchParams } = props;
    const { getFieldDecorator } = form;
    const { name, endTime, createTime } = searchParams;
    const dateFormat = 'YYYY-MM-DD';
    return (
      <Form layout="inline">
        <Row>
          <Col span={20}>
            <FormItem label='分组名称' {...formItemLayout}>
              {
                getFieldDecorator('name', {
                  initialValue: name
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem label='创建时间' {...formItemLayout}>
              {
                getFieldDecorator('date', {
                  initialValue: endTime ? [moment(createTime, dateFormat), moment(endTime, dateFormat)] : null
                })(
                  <RangePicker
                    format={dateFormat}
                    onChange={changeTime}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={onSearch}>查询</Button>
          </Col>
        </Row>
      </Form>
    )
  }
)

class GroupManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createTime: '',
      endTime: '',
    }
  }

  componentDidMount() {
    const { groupModel } = this.props;
    const { groupInfo } = groupModel;
    const { name, createTime, endTime, pageIndex, pageSize } = groupInfo;
    this._getData(name, createTime, endTime, pageIndex, pageSize);
    this.setState({
      createTime: createTime,
      endTime: endTime,
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupModel/saveSearchParams',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name: "",
        createTime: "",
        endTime: "",
      }
    });
  }

  // 获取列表
  _getData(name, createTime, endTime, pageIndex, pageSize) {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    const orderData = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      name: name,
      createTime: createTime,
      endTime: endTime,
    }
    // console.log(orderData)
    dispatch({ type: 'groupModel/saveSearchParams', payload: orderData })
    orderData['shopId'] = userInfo.shopId;
    dispatch({ type: 'groupModel/getPagegroup', payload: orderData })
  }

  // 换页
  changePage(page, pageSize) {
    const { name, createTime, endTime } = this.props.groupModel.groupInfo;
    this._getData(name, createTime, endTime, page, pageSize);
  }

  // 修改页面显示
  changePageSize(current, size) {
    const { name, createTime, endTime } = this.props.groupModel.groupInfo;
    this._getData(name, createTime, endTime, current, size);
  }

  // 修改时间
  changeTime(dates, dateStrings) {
    this.setState({
      createTime: dateStrings[0],
      endTime: dateStrings[1]
    })
  }

  // 搜索
  onSearch() {
    const { groupModel } = this.props;
    const { pageIndex, pageSize } = groupModel.groupInfo
    this.formRef.validateFields((err, value) => {
      if (err) {
        console.log(err)
      }
      const { name } = value;
      const { createTime, endTime } = this.state
      // console.log(name, createTime, endTime, pageIndex, pageSize)
      this._getData(name, createTime, endTime, pageIndex, pageSize)
    })
  }

  // 修改排除
  changeSort(value) {
    if (value) {
      const userInfo = authorization.getUserInfo();
      const orderData = {
        userId: userInfo.userId,
        groupId: parseInt(value.split('-')[1]),
        number: parseInt(value.split('-')[0])
      }
      updatenumber(orderData).then((res) => {
        if (res.status === 0) {
          message.success('排序成功');
        } else {
          message.error(res.msg)
        }
      })
    }
  }

  // 删除
  deleteGroup = (groupId) => {
    const userInfo = authorization.getUserInfo();
    const { groupModel } = this.props;
    const { groupInfo } = groupModel;
    const { name, createTime, endTime, pageIndex, pageSize } = groupInfo;
    if (groupId) {
      Modal.confirm({
        title: '提示',
        content: '确实删除吗?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteGroup({
            userId: userInfo.userId,
            groupId: groupId
          }).then((res) => {
            if (res.status === 0) {
              message.success('删除成功')
              this._getData(name, createTime, endTime, pageIndex, pageSize)
            } else {
              message.error(res.msg)
            }
          })
        }
      })
    }
  }

  render() {
    const { groupInfo } = this.props.groupModel;
    const { list, total, pageSize, pageIndex, name } = groupInfo
    const { createTime, endTime } = this.state;
    const searchParams = {
      name: name,
      createTime: createTime,
      endTime: endTime,
    }

    const columns = [
      {
        title: '分组名称',
        dataIndex: 'name',
      },
      {
        title: '分组别名',
        dataIndex: 'anotherName',
      },
      {
        title: '商品数量',
        dataIndex: 'goodsSize',
      },
      {
        title: '序号',
        width: 120,
        render: (row) => {
          return (
            <Select style={{ width: 100 }} defaultValue={row.number + '-' + row.groupId} onSelect={this.changeSort.bind(this)}>
              {
                sortKey.map((num) => {
                  return (
                    <Option key={num} value={num + '-' + row.groupId}>{num}</Option>
                  )
                })
              }
            </Select>
          )
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        render: (row) => {
          return (
            <div>
              <Button
                type="primary"
                size="small"
                style={{ marginRight: '5px' }}
                onClick={() => router.push({ pathname: '/business/group-management/edit-group', query: { groupId: row.groupId } })}>修改</Button>
              <Button type="danger" size="small" onClick={() => this.deleteGroup(row.groupId)}>删除</Button>
            </div>
          )
        }
      }
    ]

    return (
      <div className={styles.container}>
        <div className={styles.blockHead}>
          <div className={styles.blockHeadLeft}>
            <span>商品分组</span>
          </div>
          <div className={styles.blockHeadRight}>
            <Button type="primary" ghost onClick={() => { router.push('/business/group-management/edit-group') }}>新增分组</Button>
          </div>
        </div>
        <Row className={styles.content}>
          <Row className={styles.searchBlock}>
            <SearchForm
              searchParams={searchParams}
              ref={(form) => this.formRef = form}
              onSearch={this.onSearch.bind(this)}
              changeTime={this.changeTime.bind(this)}
            />
          </Row>
          <Row className={styles.table}>
            <Table
              rowKey={record => record.groupId}
              dataSource={list}
              columns={columns}
              pagination={false}
            />
          </Row>
          <Row className={styles.pagination}>
            <Pagination
              total={total}
              showSizeChanger
              showQuickJumper
              defaultPageSize={pageSize}
              defaultCurrent={pageIndex}
              onChange={this.changePage.bind(this)}
              onShowSizeChange={this.changePageSize.bind(this)}
            />
          </Row>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { groupModel: state.groupModel }
}

export default connect(mapStateToProps)(GroupManage);
