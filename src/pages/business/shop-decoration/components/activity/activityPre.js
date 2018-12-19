import React, { Component } from 'react';
import styles from './index.less';
import { Icon } from 'antd';
import BlockHead from '../blockHead/index';

export default class ActivityPreview extends Component {
  render() {
    const { canclePreview, data } = this.props;
    return (
      <div className={styles.container}>
        <BlockHead leftText="活动预览" goBackBt={canclePreview} />
        <div className={styles.previewContainer}>
          <h1><Icon className={styles.leftIcon} type="left" theme="outlined" />{data.title}</h1>
          {
            data.activityList.map((img, ind) => {
              return (
                <img key={ind} src={img.pictureUrl} alt="" />
              )
            })
          }
          {
            data.goodsList.map((value, ind) => {
              console.log(value)
              return (
                <div key={ind} className={styles.goodsContent}>
                  <h2>{value.listTitle}</h2>
                  {
                    data.id === 1 ? <div className={styles.templateA}>
                      <div className={styles.track} style={{width:  value.goodsList ? value.goodsList.length * 160 * 2 : 0 }}>
                       {
                        value.goodsList ? value.goodsList.map((goods) => {
                          return (
                            <div className={styles.goodsItem}>
                              <img src={goods.goodsUrl} alt="" />
                              <h5>{goods.goodsName}</h5>
                              <h4>¥{goods.price}</h4>
                            </div>
                          )
                        }) : null
                      }
                      </div>
                    </div> : data.id === 2 ? <div className={styles.templateB}>
                     {
                      value.goodsList ? value.goodsList.map((goods) => {
                        return (
                          <div className={styles.goodsItem}>
                            <img src={goods.goodsUrl} alt="" />
                            <h5>{goods.goodsName}</h5>
                            <h4>¥{goods.price}</h4>
                          </div>
                        )
                      }) : null
                     }
                      
                    </div> : data.id === 3 ? <div className={styles.templateB}>
                      {
                        value.goodsList ? value.goodsList.map((goods) => {
                          return (
                            <div className={styles.goodsItem}>
                              <img src={goods.goodsUrl} alt="" />
                              <h5>{goods.goodsName}</h5>
                              <h4>¥{goods.price}</h4>
                            </div>
                          )
                        }) : null
                      }
                    </div> : null 
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    ) 
  }
}