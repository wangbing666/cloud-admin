/**
 * Created by fantt on 2018/6/6.
 * 添加或编辑商品
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Spin,
  message,
} from 'antd';
import router from 'umi/router';

import { GoodsInfo, PriceRepertory, OtherInfo, Editor } from '../components';

import styles from './index.less';

class goodsEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      goodsId: this.props.match.params.index,
      title: this.props.match.params.index === '0' ? '新增' : '编辑',
      count: 1,
    }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { goodsId } = this.state;
    if (goodsId != 0) { //'0'表示添加，其他任意数字表示修改
      //获取详情
      dispatch({
        type: 'goodsEditModel/goodsDetail',
        payload: {
          goodsId: goodsId
        },
      });
    }
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

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    const { sepTable, sepFile, sepAll, sepList, fileList, goodsEditor, shopId, enterpriseId } = this.props.goodsEditModel;
    const { goodsId } = this.state;
    let sons = [], fileIds = [];

    for (let i = 0; i < fileList.length; i++) {
      fileIds.push(fileList[i].fileId)
    }
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        for (let i = 0; i < sepTable.length; i++) { // 循环table表格格式化数据
          if ((!sepTable[i].price && sepTable[i].price != 0) || (!sepTable[i].shareProfit & sepTable[i].shareProfit !=0) || (!sepTable[i].stock && sepTable[i].stock != 0)) {
            message.warning('请填写价格或库存或分润');
            return;
          }
          sons.push({
            price: sepTable[i].price,
            shareMoney: sepTable[i].shareProfit,
            son1: sepTable[i].a,
            son2: sepTable[i].b,
            son3: sepTable[i].c,
            stock: sepTable[i].stock,
          })
          console.log(sepTable)
        }
        // 判断包邮，正品保证，7天无理由退货是否选中
        values.backGoods = 0;
        if (values.condition.length > 0) {
          for (let i = 0; i < values.condition.length; i++) {
            if (values.condition[i] == '3') {
              values.backGoods = 1;
              values.condition.splice(i, 1)
            }
          }
          values.condition = values.condition.join('')
        } else {
          values.condition = '00';
        }

        values.parent1 = '';  // 规格一
        values.parent2 = ''; // 规格二
        values.parent3 = ''; // 规格三
        // 规格
        if (sepAll[0] && sepAll[0].parentName) {
          values.parent1 = sepAll[0].parentName;
          values.price = ''; // 多规格的话将单规格价格置空
        }
        if (sepAll[1] && sepAll[1].parentName) {
          values.parent2 = sepAll[1].parentName;
        }
        if (sepAll[2] && sepAll[2].parentName) {
          values.parent3 = sepAll[2].parentName;
        }
        // 判断是否新增商品,为0代表新增商品
        if (goodsId == 0) {
          values.goodsId = '';
        } else {
          values.goodsId = goodsId;
        }

        // 商品类目转换
        if (values.categoryId.length > 0) {
          values.categoryId = values.categoryId[1];
        }

        // 开售时间转换
        if (values.saleTime) {
          values.saleTime = values.saleTime.format('YYYY-MM-DD HH:mm:ss')
        }

        values.sons = sons; // 商品规格
        values.shopId = shopId, // 店铺ID
        values.specificationFiles = sepList
        values.fileIds = fileIds;
        values.enterpriseId = enterpriseId;
        values.goodsDetails = goodsEditor; // 商品详情
        values.goodsParam = ''; // 商品参数
        values.brandStory = ""; // 品牌故事
        values.instructions = ''; // 买家须知
        values.specificationFiles = sepFile;
        if (fileIds && fileIds.length > 0) { // 判断商品图片是否为空
          dispatch({
            type: 'goodsEditModel/SaveGoods',
            payload: {
              data: values
            },
          });
        } else {
          message.warning('请上传图片')
        }
      }
    });

  }

  render() {
    const { goodsEditModel, history, form } = this.props
    const { formData, detail, showListLoadding } = goodsEditModel;
    return (
      <div className={styles.goodsEdit}>
        <Form onSubmit={this.handleSubmit}>
          <div className={styles.goodsBody}>
            <Spin size="large" spinning={showListLoadding}>
              <div className={styles.cloudHead}>
                <div className={styles.cloudHeadLeft}>
                  <span>{this.state.title}商品</span>
                </div>
                <div className={styles.cloudHeadRight}>
                  <div className="row" style={{ display: 'inline-block' }}>
                    <Button type="primary" ghost onClick={() => { router.go(-1) }}>返回</Button>
                  </div>
                  <Button type="primary" ghost htmlType="submit">保存并预览</Button>
                </div>
              </div>
              <div className={styles.goods_edit}>
                <div className={styles.goods_info_edit}>
                  <GoodsInfo form={form} formData={formData} />
                  <PriceRepertory form={form} formData={formData} />
                  <OtherInfo form={form} formData={formData} goodsId={this.state.goodsId} />
                  <Editor />
                </div>
              </div>
            </Spin>
          </div>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

const goodsEditForm = Form.create()(goodsEdit);

export default connect(mapStateToProps)(goodsEditForm)
