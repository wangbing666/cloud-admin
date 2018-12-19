import {
  getGoodsDetail,
  getGrouping,
  getSaveGoods,
  getQueryAllInfos,
  addGrouping,
} from '../services/goodsEditServices';
import {
  getShelves,
  getDelGoods,
  getActivity,
  getUndergoods,
} from '../services/goodServices';

import { authorization } from 'utils';

import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'goodsEditModel',
  state: {
    shopId: authorization.getUserInfo().shopId, // 店铺ID
    enterpriseId: authorization.getUserInfo().enterpriseId, // 企业ID
    userId: authorization.getUserInfo().userId, // 商家ID
    formData: {}, // 商品详情
    goodsGrouping: null, //商品分组
    fileList: [], // 商品图片
    sepTable: [], // 商品规格列表
    sepFile: [], // 规格图片
    sepAll: [], // 商品规格
    goodsCategory: [], // 商品类目
    showListLoadding: false, // 初始化页面loading
    RowSpan1: 1, // table合并的列数
    RowSpan2: 1, // table合并的列数
    width: '', // table的宽度
    sepList: [], // 规格图展示
    goodsEditor: '', // 商品详细内容
    services: [''], // 服务说明
    stock: '', //商品总库存
  },
  effects: {
    //获取商品详情
    * goodsDetail({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getGoodsDetail, payload.goodsId);
      if (data && data.status == 0) {
        let body = data.body;
        yield put({
          type: 'initListData',
          payload: { formData: body.Object, stock: body.Object.stock }
        })
        if (body.Object && body.Object.uploadFileList && body.Object.uploadFileList.length !== 0) {
          yield put({ // 回显商品图片
            type: 'setUploadList',
            payload: { fileList: body.Object.uploadFileList }
          })
          // 格式化服务说明
          if (body.Object.serviceDescription) {
            let service = body.Object.serviceDescription.split('&&')
            yield put({
              type: 'setServices',
              payload: { services: service }
            })
          }
        }
        if (body.details && body.details.sepAll && body.details.sepFile && body.details.sepTable) {
          let sepAll = body.details.sepAll;
          let sepList = [];
          yield put({
            type: 'setSepTable',
            payload: { sepTable: body.details.sepTable }
          })
          // 格式化商品规格图
          for (let i = 0; i < body.details.sepFile.length; i++) {
            sepList.push({
              specificationName: body.details.sepFile[i].NAME,
              fileId: body.details.sepFile[i].FILEID,
              hostUrl: body.details.sepFile[i].HOST_URL,
              fileUrl: body.details.sepFile[i].FILE_URL,
              parentId: body.details.sepFile[i].PARENT_ID,
            })
          }
          yield put({ // 规格图
            type: 'setSepFile',
            payload: { sepFile: sepList }
          })
          yield put({
            type: 'setSepAll',
            payload: { sepAll: body.details.sepAll }
          })
          yield put({ // 设置每个td表格的宽度
            type: 'setWidth',
            payload: { width: 100 / (sepAll.length + 4) }
          })

          if (sepAll[0]) {
            if (sepAll[1]) {
              yield put({ // 设置合并的单元格
                type: 'setRowSpan1',
                payload: { RowSpan1: sepAll[1].childName.length }
              })
              if (sepAll[2]) {
                yield put({ // 设置合并的单元格
                  type: 'setRowSpan1',
                  payload: { RowSpan1: sepAll[1].childName.length * sepAll[2].childName.length }
                })
                yield put({ // 设置合并的单元格
                  type: 'setRowSpan2',
                  payload: { RowSpan2: sepAll[2].childName.length }
                })
              }
            }
          }
        }
        // 商品详细内容
        if (body.details) {
          yield put({
            type: 'setEditor',
            payload: { goodsEditor: body.details.detail }
          })
        }
        yield put({ type: 'hideListLoadding' });
      } else if (data && data.status !== 0 && data.msg) {
        yield put({ type: 'hideListLoadding' });
        message.error(data.msg);
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('服务器请求出错了');
      }
    },

    // 查询商品类目
    * queryAllInfos({ payload }, { call, put }) {
      const data = yield call(getQueryAllInfos, payload);
      if (data && data.status == 0 && data.body && data.body.categoryList) {
        let list = data.body.categoryList;
        let item = [];
        for (let i = 0; i < list.length; i++) {
          item.push({ value: list[i].fu.categoryId, label: list[i].fu.categoryName })
          if (list[i].zi && list[i].zi.length > 0) {
            item[i].children = [];
            for (let j = 0; j < list[i].zi.length; j++) {
              item[i].children.push({
                value: list[i].zi[j].categoryId, label: list[i].zi[j].categoryName
              })
            }
          }
        }
        yield put({
          type: 'setGoodsCategory',
          payload: { goodsCategory: item }
        })
      } else {
        message.error('服务器请求出错了');
      }
    },

    //获取商品分组
    * grouping({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getGrouping, payload);
      yield put({ type: 'hideListLoadding' });
      if (data && data.status == 0 && data.body && data.body.groupList) {
        let body = data.body.groupList;
        yield put({
          type: 'initListData',
          payload: { goodsGrouping: body }
        })
      } else if (data && data.status && data.body) {
        message.error(data.msg || '请求错误');
      } else {
        message.error('服务器请求出错了');
      }
    },

    // 新增商品分组
    * addgrouping({ payload }, { call, put }) {
      const data = yield call(addGrouping, payload);
      if (data && data.status == 0) {
        message.success(data.msg || '添加成功');
      } else {
        message.error(data && data.msg ? data.msg : '网络请求出错了，请稍后再试');
      }
    },

    // 编辑保存商品
    * SaveGoods({ payload }, { call, put }) {
      const data = yield call(getSaveGoods, payload.data);
      if (data && data.status == 0) {
        message.success(data.msg || '操作成功');
        router.push(`/business/goods-management/goods-preview/${data.body.goodsId}`);
      } else {
        message.error(data.msg ? data.msg : '未知错误');
      }
    },

    //商品上架
    * Shelves({ payload }, { call, put }) {
      const data = yield call(getShelves, payload);
      console.log('data---->', data);
      if (data && data.status == 0) {
        message.success('操作成功');
      } else {
        message.error(data.msg || '网络请求出错了，请重试');
      }
    },

    // 删除商品
    * delGoods({ payload }, { call, put }) {
      const data = yield call(getDelGoods, payload);
      console.log('data---->', data);
      if (data && data.status == 0) {
        message.success('操作成功');
        router.push(`/business/goods-management/`);
      } else {
        message.error('网络请求出错了，请重试');
      }
    },

    // 商品下架
    * Undergoods({ payload }, { call, put }) {
      const data = yield call(getUndergoods, payload);
      console.log('data---->', data);
      if (data && data.status == 0) {
        message.success('操作成功');
      } else {
        message.error(data.msg || '网络请求出错了，请重试');
      }
    },

    // 判断商品是否处于活动状态
    * isActivity({ payload }, { call, put }) {
      const data = yield call(getActivity, payload.goodsId);
      console.log('data---->', data);
      if (data && data.status == 1) {

      } else if (data && data.status == 2) {

      } else {
        message.error(data.msg);
      }
    },

  },
  reducers: {
    initListData(state, action) {
      return { ...state, ...action.payload }
    },
    setGoodsDetail(state, action) {
      return { ...state, formData: {}, detail: {} }
    },
    setUploadList(state, action) {
      return { ...state, ...action.payload }
    },
    setSepTable(state, action) {
      return { ...state, ...action.payload }
    },
    setSepFile(state, action) {
      return { ...state, ...action.payload }
    },
    setSepAll(state, action) {
      return { ...state, ...action.payload }
    },
    setGoodsCategory(state, action) { // 商品类目
      return { ...state, ...action.payload }
    },
    showListLoadding(state) {
      return { ...state, showListLoadding: true };
    },
    hideListLoadding(state) {
      return { ...state, showListLoadding: false };
    },
    setRowSpan1(state, action) {
      return { ...state, ...action.payload };
    },
    setRowSpan2(state, action) {
      return { ...state, ...action.payload };
    },
    setWidth(state, action) {
      return { ...state, ...action.payload };
    },
    setSepList(state, action) {
      return { ...state, ...action.payload };
    },
    setEditor(state, action) { // 设置富文本编辑
      return { ...state, ...action.payload };
    },
    setServices(state, action) { // 设置服务说明
      return { ...state, ...action.payload };
    },
    setStock(state, action) { // 设置商品总库存
      return { ...state, ...action.payload };
    }
  }
}