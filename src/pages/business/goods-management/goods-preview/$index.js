/**
 * Created by fantt on 2018/6/8.
 * 预览商品
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import {
  Button,
  Form,
  Spin,
  Row,
  Col,
  Modal,
  Carousel,
  Icon,
} from 'antd';

import styles from './index.less';

class goodsPreview extends Component {

  constructor(props) {
    super(props);

    /*
    * title 模态框title
    * ModalText 模态框提示文字
    * okText 模态框按钮文字
    * status 模态框种类 1为删除 2为上架 3为下架
    * visible 模态框显示与隐藏
    * confirmLoading 点击模态框确定后请求loading
    * visibleEdit 处于活动中商品提示框
    * goodsId 商品ID
    */
    this.state = {
      title: '确认删除',
      ModalText: '是否确认删除该商品',
      okText: '确定',
      status: 1,
      visible: false,
      visibleEdit: false,
      confirmLoading: false,
      goodsId: this.props.match.params.index,
    }
  }


  componentDidMount() {
    this.initDetail()
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsEditModel/setGoodsDetail',
    });
    dispatch({ // 图片置空
      type: 'goodsEditModel/setUploadList',
      payload: {
        fileList: [],
      },
    });
    dispatch({ // 富文本编辑器置空
      type: 'goodsEditModel/setEditor',
      payload: {
        goodsEditor: "",
      },
    });
    dispatch({ // 规格置空
      type: 'goodsEditModel/setSepTable',
      payload: {
        sepTable: [],
      },
    });
    dispatch({ // 规格置空
      type: 'goodsEditModel/setSepAll',
      payload: {
        sepAll: [],
      },
    });
    dispatch({ // 上传图片置空
      type: 'goodsEditModel/setSepFile',
      payload: {
        sepFile: [],
      },
    });
    dispatch({ // 表格合并单元格置空
      type: 'goodsEditModel/setRowSpan1',
      payload: {
        RowSpan1: 1,
      },
    });
    dispatch({ // 表格合并单元格置空
      type: 'goodsEditModel/setRowSpan2',
      payload: {
        RowSpan2: 1,
      },
    });
    dispatch({ // 服务说明置空
      type: 'goodsEditModel/setServices',
      payload: {
        services: [''],
      },
    });
    dispatch({ // 库存置空
      type: 'goodsEditModel/setStock',
      payload: {
        stock: '',
      },
    });
  }

  // 刷新页面
  initDetail = () => {
    const { dispatch } = this.props;
    const { goodsId } = this.state;
    //获取详情
    dispatch({
      type: 'goodsEditModel/goodsDetail',
      payload: {
        goodsId: goodsId
      },
    });
  }

  // 删除
  batchDel = () => {
    this.setState({
      visible: true,
      status: 1,
      title: '确认删除',
      okText: '确认删除',
      ModalText: '是否确认删除该商品',
    });
  }

  // 上架
  onChangShelves = () => {
    this.setState({
      visible: true,
      title: '确认上架',
      status: 2,
      okText: '确认上架',
      ModalText: '是否确认上架该商品',
    });
  }

  // 下架
  onBelowShelves = () => {
    this.setState({
      visible: true,
      title: '确认下架',
      status: 3,
      okText: '确认下架',
      ModalText: '是否确认下架该商品',
    });
  }

  // 确认操作
  handleOk = () => {
    const { status, goodsId } = this.state;
    const { dispatch, goodsEditModel } = this.props;
    this.setState({
      confirmLoading: true,
    });
    if (status == 1) {
      console.log('执行删除操作')
      dispatch({
        type: 'goodsEditModel/delGoods',
        payload: {
          head: {},
          data: { goodsIdList: [goodsId] },
        }
      })
        .then(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
        })
    }
    if (status == 2) {
      dispatch({
        type: 'goodsEditModel/Shelves',
        payload: {
          goodsId: goodsId,
          status: 1,
          shopId: goodsEditModel.shopId // 存于本地session中
        }
      })
        .then(() => {
          this.initDetail();
          this.setState({
            visible: false,
            confirmLoading: false,
          });
        })
    }
    if (status == 3) {
      console.log('执行下架操作')
      dispatch({
        type: 'goodsEditModel/Undergoods',
        payload: {
          goodsId: goodsId,
          status: 2,
          shopId: goodsEditModel.shopId // 存于本地session中
        }
      })
        .then(() => {
          this.initDetail();
          this.setState({
            visible: false,
            confirmLoading: false,
          });
        })
    }
  }

  // 取消操作
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
      visibleEdit: false,
    });
  }

  // 确认操作活动中商品
  handleEditOk = () => {
    this.setState({
      ModalText: '操作中，请稍后...',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visibleEdit: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  render() {
    const { history, goodsEditModel } = this.props;
    const { formData, showListLoadding, goodsEditor, services, sepAll } = goodsEditModel;
    const { visible, confirmLoading, ModalText, title, okText, goodsId } = this.state;
    // 格式化商品状态
    function getGoodsStatus() {
      if (formData.status == 0) {
        return '待上架'
      }
      if (formData.status && formData.status == 1) {
        return '上架中'
      }
      if (formData.status && formData.status == 2) {
        return '已下架'
      }
      if (formData.status && formData.status == 3) {
        return '草稿箱'
      }
    }

    // 规格展示
    const specifications = () => {
      if (sepAll && sepAll.length > 0) {
        return (
          <div className={styles.goods_spe}>
            {sepAll.map((item, i) => {
              return (
                <div key={i} className={styles.goods_spe_title}>
                  <h4>{item.parentName}</h4>
                  <ul>
                    {item.childName.map((lists, j) => {
                      return <li key={j}>{lists}</li>
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        )
      }
    }
    return (
      <div className={styles.goodsPreview}>
        <div className={styles.goodsBody}>
          <div className={styles.cloudHead}>
            <div className={styles.cloudHeadLeft}>
              <span>商品预览</span>
            </div>
            <div className={styles.cloudHeadRight}>
              <div className={styles.row} style={{ display: 'inline-block' }}>
                <Button type="primary" ghost onClick={() => { router.push(`/business/goods-management`) }}>返回列表</Button>
              </div>
              <div className={styles.row} style={{ display: 'inline-block' }}>
                <Button type="primary" ghost onClick={this.batchDel}>删除商品</Button>
              </div>
              <Link to={`/business/goods-management/goods-edit/${goodsId}`}>
                <Button type="primary" ghost>编辑商品</Button>
              </Link>
            </div>
          </div>
          <Spin size="large" spinning={showListLoadding}>
            <div className={styles.goods_status}>
              <Row>
                <Col span={24} className={styles.product_status}>
                  <div className={styles.product_text}>
                    商品状态：
                    <span>{getGoodsStatus()}</span>
                  </div>
                  {formData.status == 0 || formData.status == 2 ? <Button type="primary" onClick={this.onChangShelves}>上架</Button> : null}
                  {formData.status && formData.status == 1 ? <Button type="primary" onClick={this.onBelowShelves}>下架</Button> : null}
                </Col>
              </Row>
            </div>
            <div className={styles.mobile}>
              <h3>商品预览</h3>
              <div className={styles.mobile_preview}>
                {formData.uploadFileList && formData.uploadFileList.length !== 0 ?
                  <Carousel autoplay>
                    {formData.uploadFileList.map((item, index) => {
                      return <img key={index} src={item.hostUrl + item.fileUrl} alt="" />
                    })}
                  </Carousel> : null
                }
                <div className={styles.goods_info}>
                  <div className={styles.goods_name}>
                    <h3>{formData.goodsName}</h3>
                    <p>有货</p>
                  </div>
                  <div className={styles.goods_price}>
                    <div>
                      <h3>价格：￥{formData.price}</h3>
                      {formData.linePrice ? <div>划线价：{formData.linePrice}</div> : null}
                    </div>
                    <p>{formData.describe}</p>
                  </div>
                </div>
                {specifications()}
                <div className={styles.goods_instructions}>
                  <Row>
                    {formData.condition && formData.condition == 1 || formData.condition == 21 || formData.condition == 12 ? <Col span={6} className={styles.goods_commitment}>
                      <span className={styles.radio}><Icon type="check" theme="outlined" /></span>包邮
                    </Col> : null}
                    {formData.condition && formData.condition == 2 || formData.condition == 21 || formData.condition == 12 ? <Col span={6} className={styles.goods_commitment}>
                      <span className={styles.radio}><Icon type="check" theme="outlined" /></span>正品保证
                    </Col> : null}
                    {formData.backGoods && formData.backGoods == 1 ? <Col span={12} className={styles.goods_commitment}>
                      <span className={styles.radio}><Icon type="check" theme="outlined" /></span>七天无理由退货
                    </Col> : null}
                  </Row>
                  <div className={styles.service_description}>
                    {services.map((item, index) => {
                      return <p key={index}>{item}</p>
                    })}
                  </div>
                </div>
                <div className={styles.goods_detail} dangerouslySetInnerHTML={{ __html: goodsEditor }}></div>
              </div>
            </div>
          </Spin>
        </div>
        <Modal title={title}
          visible={visible}
          onOk={this.handleOk}
          okText={okText}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{ModalText}</p>
        </Modal>
        <Modal
          title="提示"
          visible={this.state.visibleEdit}
          onOk={this.handleEditOk}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
          okText="确定修改"
        >
          <p>该商品正在参与活动</p>
          <p>确定要编辑/下架/删除商品，则停止当前该商品所有活动</p>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

export default connect(mapStateToProps)(goodsPreview)
