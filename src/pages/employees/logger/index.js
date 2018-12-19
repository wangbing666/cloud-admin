import React, { Component } from 'react';
import { Button, Form, Input, Row, Col, Table, Pagination, DatePicker } from 'antd';
import styles from './index.less';
import { connect } from "dva";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 12
  }
}
const columns = [{
  title: '序列号',
  dataIndex: 'operateLogId',
}, {
  title: '姓名',
  dataIndex: 'realname',
}, {
  title: '登录名',
  dataIndex: 'username',
}, {
  title: '登录IP',
  dataIndex: 'loginIp',
}, {
  title: '操作说明',
  dataIndex: 'operateContent',
}, {
  title: '操作时间',
  dataIndex: 'modifyTime',
}]


const SearchForm = Form.create()(
  class CreateForm extends Component {
    render() {
      const { form, searchParams, changeTime } = this.props;
      const { startTime, endTime, loginIp, realname, userId} = searchParams
      const { getFieldDecorator } = form;
      const dateFormat = 'YYYY-MM-DD';
      return (
        <div className={styles.searchForm}>
          <Form>
            <Row>
              {/* <Col span={8} style={{style}}>
                <FormItem label="操作用户" {...formItemLayout}>
                {
                  getFieldDecorator('userId', {
                    initialValue: userId,
                    getValueFromEvent: e => {
                      return e.target.value.replace(/[^\d]/g, '');
                    }
                  })(<Input />)
                }
                </FormItem>
              </Col> */}
              <Col span={6}>
                <FormItem label="姓名" {...formItemLayout}>
                {
                  getFieldDecorator('realname', {
                    initialValue: realname,
                  })(<Input />)
                }
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="登陆ip" {...formItemLayout}> 
                {
                  getFieldDecorator('loginIp', {
                    initialValue: loginIp
                  })(<Input />)
                }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="操作时间" {...formItemLayout}>
                  <RangePicker
                    format={dateFormat}
                    onChange={changeTime}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form> 
        </div>
      )
    }
  }
)

class Logger extends Component {
  componentDidMount() {
    this.getData()
  }
  getData() {
    const { dispatch, loggerModel } = this.props;
    const { searchParams } = loggerModel;
    dispatch({type: 'loggerModel/queryOperateLog', payload: searchParams })
  }
  async changePage(page, size) {
    const orderData = {
      pageNow: page,
      pageSize: size,
    }
    const { dispatch } = this.props;
    await dispatch({ type: 'loggerModel/saveSearchParams', payload: orderData })
    this.getData()
  }
  async changePageSize(page, size) {
    const orderData = {
      pageNow: page,
      pageSize: size,
    }
    const { dispatch } = this.props;
    await dispatch({ type: 'loggerModel/saveSearchParams', payload: orderData })
    this.getData()
  }
  // 修改时间
  async changeTime(dates, dateStrings) {
    const orderData = {
      startTime: dateStrings[0],
      endTime: dateStrings[1],
    }
    const { dispatch } = this.props;
    await dispatch({ type: 'loggerModel/saveSearchParams', payload: orderData })
    this.getData()
  }
  // 
  onSearch() {
    this.formRef.validateFields(async (err, value) => {
      if (err) {
        console.log(err)
        return
      }
      const orderData = {
        userId: '',
        realname: value.realname,
        loginIp: value.loginIp,
      }
      const { dispatch } = this.props;
      await dispatch({ type: 'loggerModel/saveSearchParams', payload: orderData });
      this.getData()
    })
  }
  render() {
    const { loggerModel } = this.props;
    const { searchParams, list, total } = loggerModel;
    const { pageNow, pageSize } = searchParams;

    return (
      <div className={styles.container}>
        <div className={styles.blockHead}>
          <div className={styles.blockHeadLeft}>
            <span>操作日志查询</span>
          </div>
          <div className={styles.blockHeadRight}>
            <Button type="primary" ghost onClick={this.onSearch.bind(this)}>查询</Button>
          </div>
        </div>
        <div className={styles.content}>
          <SearchForm 
            searchParams={searchParams}
            ref={(form) => this.formRef = form} 
            changeTime={this.changeTime.bind(this)}
          />    
          <Table
           rowKey={record => record}
           columns={columns}
           dataSource={list} 
           pagination={false} 
          />
          <Row className={styles.pagination}>
            <Pagination 
              total={total} 
              showSizeChanger 
              showQuickJumper 
              defaultPageSize={pageSize} 
              defaultCurrent={pageNow}
              onChange={this.changePage.bind(this)} 
              onShowSizeChange={this.changePageSize.bind(this)}
            />
          </Row>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { loggerModel: state.loggerModel }
}

export default connect(mapStateToProps)(Logger);
