/**
 * Created by fantt on 2018/7/19.
 * 添加或编辑部门
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Spin,
  Row,
  Select,
  Input,
  Modal,
} from 'antd';
import router from 'umi/router';

import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class DepartmentEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.index,
      title: this.props.match.params.index === "0" ? '新增' : '编辑',
      visible: false,
      visible1: false,
      confirmLoading: false,
    }
  }

  componentDidMount() {
    const { dispatch, departmentModel } = this.props;
    const { id } = this.state;
    if (this.state.id === '0') { //'0'表示添加，其他任意数字表示修改
      dispatch({
        type: 'departmentModel/setDeptDetail',
        payload: {
          departmentDetail: [],
        }
      });
      this.getDepList();
    } else {
      dispatch({
        type: 'departmentModel/DeptDetail',
        payload: {
          deptId: id,
          userId: departmentModel.userId,
        }
      });
      this.getDepList(id)
    }
  }

  // 查询上级部门列表
  getDepList = (deptId) => {
    const { dispatch, departmentModel } = this.props;
    dispatch({
      type: 'departmentModel/DeptList',
      payload: {
        bussId: departmentModel.bussId,
        bussType: departmentModel.bussType,
        deptId: deptId || '',
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, departmentModel } = this.props;
    const { id } = this.state;
    const { bussId, bussType, userId, enterpriseId } = departmentModel;
    if (id == 0) {
      this.props.form.validateFields((err, value) => {
        if (!err) {
          dispatch({
            type: 'departmentModel/saveOrUpdateDept',
            payload: {
              ...value,
              userId: userId,
              bussId: bussId,
              bussType: bussType,
              enterpriseId: enterpriseId,
            }
          });
        }
      })
    } else {
      this.props.form.validateFields((err, value) => {
        if (!err) {
          dispatch({
            type: 'departmentModel/saveOrUpdateDept',
            payload: {
              ...value,
              deptId: id,
              userId: userId,
              bussId: bussId,
              bussType: bussType,
              enterpriseId: enterpriseId,
            }
          });
        }
      })
    }
  }

  // 删除操作
  handleDel = () => {
    const { departmentModel } = this.props;
    const { hasEmployee } = departmentModel;
    if (hasEmployee == 1) {
      this.setState({
        visible1: true,
      })
    } else {
      this.setState({
        visible: true,
      })
    }
  }

  // 确认操作
  handleOk = () => {
    const { dispatch, departmentModel } = this.props;
    const { id } = this.state;
    this.setState({
      confirmLoading: true,
    })
    dispatch({
      type: 'departmentModel/DeleteDept',
      payload: {
        userId: departmentModel.userId,
        deptId: id,
        bussType: 2,
        bussId: departmentModel.bussId
      }
    })
      .then(() => {
        this.setState({
          confirmLoading: false,
        })
      })
  }

  // 取消操作
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  // 取消操作
  handleCancel1 = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible1: false,
    });
  }

  render() {
    const { departmentModel, history, form } = this.props
    const { id, title, visible, confirmLoading, visible1 } = this.state;
    const { departmentDetail, superiorDdepList } = departmentModel;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 }
    }
    return (
      <div className={styles.departmentEdit}>
        <Form onSubmit={this.handleSubmit}>
          <div className={styles.departmentBody}>
            <Spin size="large" spinning={false}>
              <div className={styles.cloudHead}>
                <div className={styles.cloudHeadLeft}>
                  <span>{title}部门</span>
                </div>
                <div className={styles.cloudHeadRight}>
                  {id == 0 ? null :
                    <div className="row" style={{ display: 'inline-block' }}>
                      <Button type="primary" onClick={this.handleDel}>删除</Button>
                    </div>
                  }
                  <div className="row" style={{ display: 'inline-block' }}>
                    <Button type="primary" htmlType="submit">保存</Button>
                  </div>
                  <Button type="default" onClick={() => { router.go(-1) }}>返回</Button>
                </div>
              </div>
              <div className={styles.department_edit}>
                <Row className={styles.edit}>
                  <FormItem {...formItemLayout} label="部门名称">
                    {getFieldDecorator('deptName', {
                      initialValue: departmentDetail.name,
                      rules: [
                        { required: true, message: '请输入部门名称' },
                        { whitespace: true, message: '请输入正确的内容' },
                        { pattern: /[\u4E00-\u9FA5]/g, message: '只能输入中文汉字' }
                      ],
                    })(
                      <Input placeholder="" type="text" maxLength="10" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="上级部门">
                    {getFieldDecorator('parentId', {
                      initialValue: departmentDetail.parentId,
                      rules: [{ required: true, message: '请选择上级部门' }],
                    })(
                      <Select>
                        {superiorDdepList.map((item, index) => {
                          return <Option value={item.deptId} key={index}>{item.deptName}</Option>
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Row>
              </div>
            </Spin>
          </div>
        </Form>
        <Modal title="提示"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>是否确认删除该部门？</p>
        </Modal>
        <Modal title="提示"
          className={styles.modal_dpt}
          visible={visible1}
          onCancel={this.handleCancel1}
          footer={null}
        >
          <p>该部门已分配员工，请先将员工分配到其他部门，再删除该部门</p>
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <Button type="primary" onClick={this.handleCancel1}>确定</Button>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { departmentModel: state.departmentModel };
};

const DepartmentEditForm = Form.create()(DepartmentEdit);

export default connect(mapStateToProps)(DepartmentEditForm)
