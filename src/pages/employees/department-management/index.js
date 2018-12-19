/**
 * Created by wangbing on 2018/7/19.
 * 商品管理
 */
import React from 'react';
import { Button, Form, Input, Select, Spin, Table, Pagination, Row, Col, Divider, Modal, message } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';

import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const columns = [{
  title: '部门名称',
  dataIndex: 'name',
  align: 'center',
  key: 'name',
}, {
  title: '上级部门',
  dataIndex: 'parentName',
  align: 'center',
  key: 'parentName',
}];

class Department extends React.Component {

  constructor(props) {
    super(props);

    /*
    * productList 批量删除选中的商品
    * title 模态框title
    * ModalText 模态框提示文字
    * okText 模态框按钮文字
    * status 模态框种类 1为删除 2为上架 3为下架
    * visible 模态框显示与隐藏
    * confirmLoading 点击模态框确定后请求loading
    * visibleEdit 处于活动中商品提示框
    */
    this.tableColumn = columns.concat({
      title: '操作',
      dataIndex: 'opration',
      key: 'opration',
      align: 'center',
      width: '15%',
      render: (text, record) => {
        return (
          <div>
            <Link to={`/employees/department-management/department-edit/${record.deptId}`}>
              <label>查看详情</label>
            </Link>
          </div>
        );
      }
    })
  }

  componentDidMount() {
    const { dispatch, departmentModel } = this.props;
    dispatch({// 查询部门列表
      type: 'departmentModel/searchListData',
      payload: {
        ...departmentModel.searchData,
        pageNow: departmentModel.pageNow,
        pageSize: departmentModel.pageSize,
        bussId: departmentModel.bussId,
        bussType: departmentModel.bussType,
        userId: departmentModel.userId,
      }
    });
    dispatch({// 查询上级部门列表
      type: 'departmentModel/DeptList',
      payload: {
        bussId: departmentModel.bussId,
        bussType: departmentModel.bussType,
        deptId: '',
      }
    });
  }

  //搜索部门
  getSearchData = (e) => {
    e.preventDefault();
    const { dispatch, departmentModel } = this.props;
    dispatch({ type: 'departmentModel/setPageNow', payload: { pageNow: 1 } });
    this.props.form.validateFields((err, value) => {
      dispatch({ type: 'departmentModel/setSearchData', payload: { searchData: value } });
      dispatch({
        type: 'departmentModel/searchListData',
        payload: {
          ...value,
          pageNow: departmentModel.pageNow,
          pageSize: departmentModel.pageSize,
          bussId: departmentModel.bussId,
          bussType: departmentModel.bussType,
          userId: departmentModel.userId,
        }
      });
    })
  }

  //设置PageSize
  setShowSizeChange = (current, pageSize) => {
    const { dispatch, departmentModel } = this.props;
    dispatch({ type: 'departmentModel/setPageShowSize', payload: { pageSize } });
    dispatch({ type: 'departmentModel/setPageNow', payload: { pageNow: 1 } });

    dispatch({
      type: 'departmentModel/searchListData',
      payload: {
        ...departmentModel.searchData,
        pageNow: departmentModel.pageNow,
        pageSize: pageSize,
        bussId: departmentModel.bussId,
        bussType: departmentModel.bussType,
        userId: departmentModel.userId,
      }
    });
  };

  //设置PageNow
  setNewPageNow = (pageNow, pageSize) => {
    const { dispatch, departmentModel } = this.props;
    dispatch({ type: 'departmentModel/setPageNow', payload: { pageNow } });
    dispatch({
      type: 'departmentModel/searchListData',
      payload: {
        ...departmentModel.searchData,
        pageNow: pageNow,
        pageSize: departmentModel.pageSize,
        bussId: departmentModel.bussId,
        bussType: departmentModel.bussType,
        userId: departmentModel.userId,
      }
    });
  };

  render() {
    const { departmentModel, form } = this.props;
    const { getFieldDecorator } = form;
    const { searchData, departmentList, superiorDdepList, pageNow, total, pageSize, showListLoadding } = departmentModel;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 }
    }

    return (
      <div className={styles.departmentlist}>
        <div className={styles.departmentBody}>
          <div className={styles.cloudHead}>
            <div className={styles.cloudHeadLeft}>
              <span>部门查询</span>
            </div>
            <div className={styles.cloudHeadRight}>
              <div className={styles.row} style={{ display: 'inline-block' }}>
                <Link to={`/employees/department-management/department-edit/0`}>
                  <Button type="primary" ghost>新增部门</Button>
                </Link>
              </div>
            </div>
          </div>
          <Form onSubmit={this.getSearchData} className={styles.searchForm}>
            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="部门名称">
                  {getFieldDecorator('deptName', { initialValue: searchData.deptName })(
                    <Input placeholder="" />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="上级部门">
                  {getFieldDecorator('parentId', { initialValue: searchData.parentId })(
                    <Select>
                      <Option value={0}>全部</Option>
                      {superiorDdepList.map((item, index) => {
                        return <Option value={item.deptId} key={index}>{item.deptName}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <Button type="primary" htmlType="submit">搜索</Button>
              </Col>
            </Row>
          </Form>
          <div className={styles.department_table}>
            <Spin size="large" spinning={showListLoadding}>
              <div className={styles.tableContent}>
                <Table columns={this.tableColumn}
                  dataSource={departmentList}
                  pagination={false}
                  rowKey={(r, i) => i} />
              </div>
              {departmentList.length > 0 ?
                <Pagination showSizeChanger current={pageNow}
                  onShowSizeChange={this.setShowSizeChange}
                  onChange={this.setNewPageNow} total={total}
                  defaultPageSize={pageSize}
                  className={styles.pagination} showQuickJumper />
                : <div className="bottomDiv"></div>}
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { departmentModel: state.departmentModel }
}

const DepartmentForm = Form.create()(Department)

export default connect(mapStateToProps)(DepartmentForm)