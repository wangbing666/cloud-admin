import React from 'react';
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Tag,
  Select,
  Upload,
  Icon,
  message,
} from 'antd';
import { connect } from 'dva';
import { uploadQiniu } from 'utils';

import styles from '../../goods-edit/index.less';
import { sep } from 'path';
const FormItem = Form.Item;
const Option = Select.Option;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class Specifications extends React.Component {

  constructor(props) {
    super(props)
  }
  /**
  * loading 上传图片loading
  * generateTable 规格明细表格展示与隐藏
  * specifications 规格项展示与隐藏
  * scContent 规格内容输入框展示与隐藏
  * scList 规格内容列表展示与隐藏
  * data 添加或删除存放商品规格数据
  * title 添加或删除存放规格名称列表
  * tabledata 表格渲染时的数据
  * titleList 展示规格图中规格名称列表
  * count 规格项长度，不超过3个
  * value 获取规格内容值
  */

  state = {
    loading: false,
    generateTable: false,
    specifications: [],
    scContent: [],
    scList: [],
    data: [],
    tabledata: [],
    title: [],
    titleList: [],
    value: '',
    count: 0,
    form: [],
    price: '',
    inventory: '',
    fenrun: '',
  }

  // 添加规格项
  addSpecifications = (e) => {
    let { count } = this.state;
    const { sepTable, sepFile, sepAll } = this.props.goodsEditModel
    this.setState({
      count: sepAll.length
    })
    if (sepAll.length < 3) { // 只有在规格项小于3个时才可添加,并展示可添加的列表
      sepAll.push({ parentName: '', childName: [], })
      count++;
    }
  }

  // 添加规格内容
  onScContent = (index) => {
    const { sepTable, sepFile, sepAll } = this.props.goodsEditModel
    let { data, scContent, value } = this.state;
    const ref = this.refs;
    if (ref.title0 && index == 0) {
      for (let i = 0; i < sepAll.length; i++) {
        if (ref.title0.input.value == sepAll[i].parentName && ref.title0.input.value != sepAll[index].parentName) {
          message.info('请不要输入相同的规格名称');
          return;
        }
      }
      if (ref.title0.input.value) {
        scContent[index] = index
        sepAll[index].parentName = ref.title0.input.value;
      }
    }
    if (ref.title1 && index == 1) {
      for (let i = 0; i < sepAll.length; i++) {
        if (ref.title1.input.value == sepAll[i].parentName && ref.title1.input.value != sepAll[index].parentName) {
          message.info('请不要输入相同的规格名称');
          return;
        }
      }
      if (ref.title1.input.value) {
        scContent[index] = index
        sepAll[index].parentName = ref.title1.input.value;
      }
    }
    if (ref.title2 && index == 2) {
      for (let i = 0; i < sepAll.length; i++) {
        if (ref.title2.input.value == sepAll[i].parentName && ref.title2.input.value != sepAll[index].parentName) {
          message.info('请不要输入相同的规格名称');
          return;
        }
      }
      if (ref.title2.input.value) {
        sepAll[index].parentName = ref.title2.input.value;
        scContent[index] = index
      }
    }
    this.setState({
      scContent,
    })
  }

  // 失去焦点后保存规格名称
  onScBlur = (index) => {
    // this.onScContent(index)
  }

  //确认规格内容
  onConfirmContent = (index) => {
    let { data, scContent, scList } = this.state;
    const { sepTable, sepFile, sepAll } = this.props.goodsEditModel
    const ref = this.refs;
    if (ref.content0 && index == 0) {
      if (ref.content0.input.value) {
        scContent[index] = -1;
        if (sepAll[index].childName.length >= 7) {
          message.info('您最多只能添加7个规格内容');
          return;
        }
        for (let i = 0; i < sepAll[index].childName.length; i++) {
          if (sepAll[index].childName[i] == ref.content0.input.value) {
            message.info('不能输入相同的规格内容');
            return;
          }
        }
        sepAll[index].childName.push(ref.content0.input.value);
      }
    }
    if (ref.content1 && index == 1) {
      if (ref.content1.input.value) {
        scContent[index] = -1;
        if (sepAll[index].childName.length >= 7) {
          message.info('您最多只能添加7个规格内容');
          return;
        }
        for (let i = 0; i < sepAll[index].childName.length; i++) {
          if (sepAll[index].childName[i] == ref.content1.input.value) {
            message.info('不能输入相同的规格内容');
            return;
          }
        }
        sepAll[index].childName.push(ref.content1.input.value);
      }
    }

    if (ref.content2 && index == 2) {
      if (ref.content2.input.value) {
        scContent[index] = -1;
        if (sepAll[index].childName.length >= 7) {
          message.info('您最多只能添加7个规格内容');
          return;
        }
        for (let i = 0; i < sepAll[index].childName.length; i++) {
          if (sepAll[index].childName[i] == ref.content2.input.value) {
            message.info('不能输入相同的规格内容');
            return;
          }
        }
        sepAll[index].childName.push(ref.content2.input.value);
      }
    }
    this.setState({
      scContent,
    })
  }

  // 取消规格内容的输入
  cancelContent = (index) => {
    let { scContent, value, data } = this.state
    scContent[index] = -1;
    this.setState({
      scContent,
    })
  }

  // 删除规格项
  delSpecifications = (index) => {
    const { sepTable, sepFile, sepAll } = this.props.goodsEditModel
    const { dispatch } = this.props;
    let { specifications, scContent, data, count, scList } = this.state;
    sepAll.splice(index, 1)
    // 由于react存在受控组件和非受控组件的存在，defaultValue设置的默认值为非受控组件，故在删除其中一个规格项时，其设置的默认值并不会一起删除
    if (sepAll.length == 2) {
      this.refs.title0.input.value = sepAll[0].parentName;
      this.refs.title1.input.value = sepAll[1].parentName;
    }
    if (sepAll.length == 1) {
      this.refs.title0.input.value = sepAll[0].parentName;
    }
    count--;
    this.setState({
      count,
    })
    dispatch({
      type: 'goodsEditModel/setSepAll',
      payload: {
        sepAll: sepAll,
      },
    });
    this.onGenerateTable(); // 重新渲染列表
  }

  // 删除规格名称列表
  handleClose = (value, index) => {
    const { sepTable, sepFile, sepAll } = this.props.goodsEditModel
    const { dispatch } = this.props;
    let list = sepAll[index].childName;
    sepAll[index].childName = list.filter(list => list !== value);
    dispatch({
      type: 'goodsEditModel/setSepAll',
      payload: {
        sepAll: sepAll,
      },
    });
    this.onGenerateTable(); // 重新渲染列表
  }


  // 生成表格
  onGenerateTable = () => {
    const { sepTable, sepFile, sepAll } = this.props.goodsEditModel
    let { data, price, inventory, fenrun } = this.state;
    const { dispatch } = this.props;
    let list = [];
    var aTD = '', bTd = ''; // 

    dispatch({
      type: 'goodsEditModel/setWidth',
      payload: {
        width: 100 / (sepAll.length + 4),
      },
    });
    // 判断新增规格项有多少列（最多为3列），获取每项规格length长度
    if (sepAll[0]) {
      dispatch({
        type: 'goodsEditModel/setRowSpan1',
        payload: {
          RowSpan1: 1,
        },
      });
      dispatch({
        type: 'goodsEditModel/setRowSpan2',
        payload: {
          RowSpan2: 1,
        },
      });

      dispatch({// 默认展示第一项规格列表
        type: 'goodsEditModel/setSepList',
        payload: {
          sepList: sepAll[0].childName,
        },
      });


      // 默认展示第一个规格图
      let sepList = [];
      if (sepAll[0] && sepAll[0].childName.length > 0) {
        for (let i = 0; i < sepAll[0].childName.length; i++) {
          sepList.push({
            specificationName: sepAll[0].childName[i],
            fileId: '',
            hostUrl: '',
            fileUrl: '',
          })
        }
        dispatch({
          type: 'goodsEditModel/setSepList',
          payload: {
            sepFile: sepList,
          },
        });
      }

      if (sepAll[1]) {
        dispatch({
          type: 'goodsEditModel/setRowSpan1',
          payload: {
            RowSpan1: sepAll[1].childName.length,
          },
        });
        dispatch({
          type: 'goodsEditModel/setRowSpan2',
          payload: {
            RowSpan2: 1,
          },
        });
        if (sepAll[2]) {
          dispatch({
            type: 'goodsEditModel/setRowSpan1',
            payload: {
              RowSpan1: sepAll[1].childName.length * sepAll[2].childName.length,
            },
          });
          dispatch({
            type: 'goodsEditModel/setRowSpan1',
            payload: {
              RowSpan2: sepAll[2].childName.length,
            },
          });
        }
      }
    }

    // 循环并格式化数据，变为表格需要的格式
    if (sepAll[0]) {
      for (var i = 0; i < sepAll[0].childName.length; i++) {
        aTD = sepAll[0].childName[i];
        if (!sepAll[1] && !sepAll[2]) { // 此处判断有没有规格2和规格3
          list = [...list, {
            a: aTD,
            price: '',
            shareProfit: '',
            stock: '',
            coding: "",
          }]
        }
        if (sepAll[1]) {
          for (var j = 0; j < sepAll[1].childName.length; j++) {
            bTd = sepAll[1].childName[j]
            if (!sepAll[2]) { // 此处判断有没有规格3
              list = [...list, {
                a: aTD,
                b: bTd,
                price: '',
                shareProfit: '',
                stock: '',
                coding: "",
              }]
            }
            if (sepAll[2]) {
              for (var k = 0; k < sepAll[2].childName.length; k++) {
                list = [...list, {
                  a: aTD,
                  b: bTd,
                  c: sepAll[2].childName[k],
                  price: '',
                  shareProfit: '',
                  stock: '',
                  coding: "",
                }]
              }
            }
          }
        }
      }
    }
    dispatch({
      type: 'goodsEditModel/setSepTable',
      payload: {
        sepTable: list,
      },
    });
  }

  // 展示规格列表
  handleChange = (value) => {
    const { sepTable, sepFile, sepAll } = this.props.goodsEditModel
    const { dispatch } = this.props;
    let sepList = [];
    if (value == 0 && sepAll[0] && sepAll[0].childName.length > 0) {
      for (let i = 0; i < sepAll[0].childName.length; i++) {
        sepList.push({
          specificationName: sepAll[0].childName[i],
          fileId: '',
          hostUrl: '',
          fileUrl: '',
        })
      }
      dispatch({
        type: 'goodsEditModel/setSepList',
        payload: {
          sepFile: sepList,
        },
      });
    }
    if (value == 1 && sepAll[1] && sepAll[1].childName.length > 0) {
      for (let i = 0; i < sepAll[1].childName.length; i++) {
        sepList.push({
          specificationName: sepAll[1].childName[i],
          fileId: '',
          hostUrl: '',
          fileUrl: '',
        })
      }
      dispatch({
        type: 'goodsEditModel/setSepList',
        payload: {
          sepFile: sepList,
        },
      });
    }
    if (value == 2 && sepAll[2] && sepAll[2].childName.length > 0) {
      for (let i = 0; i < sepAll[2].childName.length; i++) {
        sepList.push({
          specificationName: sepAll[2].childName[i],
          fileId: '',
          hostUrl: '',
          fileUrl: '',
        })
      }
      dispatch({
        type: 'goodsEditModel/setSepList',
        payload: {
          sepList: sepList,
        },
      });
    }
  }

  // 上传图片
  beforeUpload = (index, info) => {
    const { sepFile } = this.props.goodsEditModel;
    const { dispatch } = this.props;
    const myForm = new FormData();
    console.log(info)
    myForm.append('file', info);
    uploadQiniu(myForm, {
      width: 200,
      height: 200,
      originHeight: 300,
      originWidth: 300,
    }).then((res) => {
      if (res && res.length > 0) {
        // fileList.push({ fileId: res[0].fileId, hostUrl: res[0].hostUrl, fileUrl: res[0].fileUrl })
        sepFile[index].fileId = res[0].fileId;
        sepFile[index].hostUrl = res[0].hostUrl;
        sepFile[index].fileUrl = res[0].fileUrl;
        dispatch({
          type: 'goodsEditModel/setUploadList',
          payload: {
            sepFile,
          },
        });
        console.log(res)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  // 批量设置价格
  onChangePriceAll = (e) => {
    const { sepTable } = this.props.goodsEditModel
    const { dispatch } = this.props;
    const value = e.target.value
    for (let i = 0; i < sepTable.length; i++) {
      sepTable[i].price = value;
    }
    dispatch({
      type: 'goodsEditModel/setSepTable',
      payload: {
        sepTable: sepTable,
      },
    });
  }

  // 批量设置库存
  onChangeInventoryAll = (e) => {
    const { sepTable } = this.props.goodsEditModel
    const { dispatch } = this.props;
    const value = e.target.value
    let count = 0;
    for (let i = 0; i < sepTable.length; i++) {
      sepTable[i].stock = value;
      count += Number(sepTable[i].stock)
    }

    dispatch({
      type: 'goodsEditModel/setSepTable',
      payload: {
        sepTable: sepTable,
      },
    });
    dispatch({
      type: 'goodsEditModel/setStock',
      payload: {
        stock: count,
      },
    });
  }

  // 批量设置分润
  onChangeFenrunAll = (e) => {
    const { sepTable } = this.props.goodsEditModel
    const { dispatch } = this.props;
    const value = e.target.value
    for (let i = 0; i < sepTable.length; i++) {
      sepTable[i].shareProfit = value;
    }
    dispatch({
      type: 'goodsEditModel/setSepTable',
      payload: {
        sepTable: sepTable,
      },
    });
  }

  // 设置单个价格
  onBlurPrice = (e, index) => {
    const { sepTable } = this.props.goodsEditModel
    const { dispatch } = this.props;
    const value = e.target.value
    sepTable[index].price = value
    dispatch({
      type: 'goodsEditModel/setSepTable',
      payload: {
        sepTable: sepTable,
      },
    });
  }

  // 设置单个库存
  onBlurInventor = (e, index) => {
    const { sepTable } = this.props.goodsEditModel;
    let stock = this.props.goodsEditModel.stock;
    const { dispatch } = this.props;
    const value = e.target.value
    stock = stock - Number(sepTable[index].stock) + Number(value)
    sepTable[index].stock = value
    dispatch({
      type: 'goodsEditModel/setSepTable',
      payload: {
        sepTable: sepTable,
      },
    });
    dispatch({
      type: 'goodsEditModel/setStock',
      payload: {
        stock,
      },
    });
  }

  // 设置单个分润
  onBlurFenrun = (e, index) => {
    const { sepTable } = this.props.goodsEditModel
    const { dispatch } = this.props;
    const value = e.target.value
    sepTable[index].shareProfit = value
    dispatch({
      type: 'goodsEditModel/setSepTable',
      payload: {
        sepTable: sepTable,
      },
    });
  }

  // 设置单个商家编码
  onBlurCoding = () => {
    // let { form } = this.state;
    // const value = e.target.value
    // form[index].coding = value;
    // this.setState({
    //   form,
    // })
  }

  // 验证价格和分润
  verifyPrice = (obj) => {
    if (obj.target.value == '0.00') {
      obj.target.value = '';
    }
    obj.target.value = obj.target.value.replace(/[^\d.]/g, "");
    obj.target.value = obj.target.value.replace(/^\./g, "");
    obj.target.value = obj.target.value.replace(/\.{2,}/g, ".");
    obj.target.value = obj.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.target.value = obj.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  }

  // 验证库存
  verifyInventory = (obj) => {
    obj.target.value = obj.target.value.replace(/[^0-9]/g, '');
    obj.target.value = obj.target.value.replace(/\D/g, '');
  }

  render() {
    const { specifications, generateTable, scContent, scList, data, tabledata, titleList } = this.state;
    const { sepTable, sepFile, sepAll, RowSpan1, RowSpan2, width, sepList } = this.props.goodsEditModel;
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const ScList = (props) => {
      const { title, childName, index } = props
      return (
        <div className={styles.specifications_list}>
          {childName.map((item, i) => {
            return <div key={i} className={styles.tag} onClick={() => this.handleClose(item, index)}>{item}<Icon type="close" /></div>
          })}
        </div>
      )
    }

    const Specifications = (
      <div>
        {sepAll.map((item, index) => {
          return (
            <div style={{ marginBottom: '20px' }} key={index}>
              <div>
                <div className={styles.specifications} id={index}>
                  <div className={styles.specifications_title}>
                    <Input
                      ref={`title${index}`}
                      placeholder="请输入规格名称"
                      maxLength="10"
                      onKeyUp={e => e.target.value = e.target.value.replace(/^\s+|\s+$/g, '')}
                      style={{ width: '150px' }}
                      defaultValue={item.parentName}
                      onBlur={() => this.onScBlur(index)}
                    />
                    <Button type="primary" onClick={() => this.onScContent(index)}>添加规格内容</Button>
                    <a href="javascript:;" onClick={() => this.delSpecifications(index)}>删除</a>
                  </div>
                  {scContent[index] == index ?
                    <div className={styles.content}>
                      <Input ref={`content${index}`} placeholder="请输入规格内容" onKeyUp={e => e.target.value = e.target.value.replace(/^\s+|\s+$/g, '')} maxLength="10" style={{ width: '150px' }} />
                      <Button type="primary" onClick={() => this.onConfirmContent(index)}>确定</Button>
                      <Button type="primary" ghost onClick={() => this.cancelContent(index)}>取消</Button>
                    </div>
                    : null}
                </div>
                {item.childName[index] != 0 ? <ScList {...item} index={index} /> : null}
              </div>
            </div>
          )
        })}
      </div>
    )

    const Tbody = () => {
      return (
        // <tbody dangerouslySetInnerHTML={{ __html: tr }}></tbody>
        <tbody>
          {sepTable.map((item, index) => {
            return (
              <tr key={index} id={index}>
                {index % RowSpan1 == 0 ? <td rowSpan={RowSpan1} style={{ width: `${width}%` }}>{item.a}</td> : null}
                {index % RowSpan2 == 0 && sepAll[1] ? <td rowSpan={RowSpan2} style={{ width: `${width}%` }}>{item.b}</td> : null}
                {sepAll[2] ? <td style={{ width: `${width}%` }}>{item.c}</td> : null}
                <td style={{ width: `${width}%` }}><Input defaultValue={item.price} type="text" maxLength="10" onKeyUp={this.verifyPrice} onBlur={(e) => this.onBlurPrice(e, index)} /></td>
                <td style={{ width: `${width}%` }}><Input defaultValue={item.stock} type="text" maxLength="8" onKeyUp={this.verifyInventory} onBlur={(e) => this.onBlurInventor(e, index)} /></td>
                <td style={{ width: `${width}%` }}><Input defaultValue={item.shareProfit} type="text" maxLength="10" onKeyUp={this.verifyPrice} onBlur={(e) => this.onBlurFenrun(e, index)} /></td>
                <td style={{ width: `${width}%` }}><Input defaultValue={item.coding} onBlur={(e) => this.onBlurCoding(e, index)} /></td>
              </tr>
            )
          })}
        </tbody>
      )
    }

    const GenerateTable = (
      <div>
        <div className={styles.specifications_detail}>
          <div className={styles.goods_specifications_title}>
            规格明细:
          </div>
          <div className={styles.specifications_table}>
            <Row>
              <Col span={3}>批量设置：</Col>
              <Col span={7}>价格：<Input style={{ width: '150px' }} type="text" maxLength="10" onKeyUp={this.verifyPrice} onBlur={this.onChangePriceAll}></Input></Col>
              <Col span={7}>库存：<Input style={{ width: '150px' }} type="text" maxLength="8" onKeyUp={this.verifyInventory} onBlur={this.onChangeInventoryAll}></Input></Col>
              <Col span={7}>分润：<Input style={{ width: '150px' }} type="text" maxLength="10" onKeyUp={this.verifyPrice} onBlur={this.onChangeFenrunAll}></Input></Col>
            </Row>
            <table>
              <thead>
                <tr>
                  {sepAll.map((item, index) => {
                    return item && item.parentName ? <th key={index}>{item.parentName}</th> : null
                  })}
                  <th>价格</th>
                  <th>库存</th>
                  <th>分润</th>
                  <th>商家编码</th>
                </tr>
              </thead>
              <Tbody />
            </table>
          </div>
        </div>
        <div className={styles.specifications_select}>
          <div className={styles.goods_specifications_title}>
            规格图:
          </div>
          <div className={styles.specifications_table}>
            <div>
              {
                sepAll.length !== 0 && sepAll[0].parentName ? <Select defaultValue={sepAll[0].parentName} style={{ width: 120 }} onChange={this.handleChange}>
                  {sepAll.map((item, index) => {
                    return <Option value={index} key={index}>{item.parentName}</Option>
                  })}
                </Select> : null
              }
            </div>
            <table>
              <thead>
                <tr>
                  <th>规格名称</th>
                  <th>商品缩略展示图</th>
                </tr>
              </thead>
              <tbody>
                {sepFile.map((item, index) => {
                  return (
                    <tr style={{ display: item.parentId == 0 ? 'none' : '' }} key={index}>
                      <td>{item.specificationName}</td>
                      <td>
                        <Upload
                          accept="image/*"
                          name="avatar"
                          listType="picture-card"
                          className={styles.avatar_uploader}
                          showUploadList={false}
                          beforeUpload={(info) => this.beforeUpload(index, info)}
                        >
                          {item.fileId ? <img src={item.hostUrl + item.fileUrl} alt="avatar" style={{ width: '100px', height: '100px' }} /> : uploadButton}
                        </Upload>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )

    return (
      <div>
        <div className={styles.goods_specifications}>
          <div className={styles.goods_specifications_title}>
            商品规格:
            </div>
          <div className={styles.right}>
            <div style={{ color: '#999', padding: ' 0 10px 10px 10px' }}>如有颜色、尺码等多种规格，请添加商品规格及图</div>
            {Specifications}
            <Button type="primary" ghost onClick={this.addSpecifications}>添加规格项</Button>
            <Button type="primary" ghost onClick={this.onGenerateTable}>生成表格</Button>
          </div>
        </div>
        {sepTable.length > 0 ? GenerateTable : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

export default connect(mapStateToProps)(Specifications)