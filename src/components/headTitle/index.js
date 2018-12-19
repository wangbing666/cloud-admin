/**
 * Created by andyWang on 2018/4/26.
 */
import React from 'react';
import styles from './index.less';

const HeadTitle = props => (
  <div className={styles.cloudHead} style={{ background: '#fff' }}>
    <div className={styles.cloudHeadLeft}>
      {props.leftImg ? <img src={props.leftImg} alt="" /> : null}
      <span>{props.leftText}</span>
    </div>
    <div className={styles.cloudHeadRight}>
      {props.rightImg ? <img src={props.leftImg} alt="" /> : null}
      {props.rightText ? <span>{props.rightText}</span> : null}
      {props.rightView ? <span>{props.rightView}</span> : null}
    </div>
  </div>
);

export default HeadTitle;
