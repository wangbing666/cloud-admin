
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Icon, Button, Modal } from 'antd';
import router from 'umi/router';

const ThemePrompt = () => { 
  return (
    <div className="prompt-dialog-modal">
      <h4>店铺风格</h4>
      <p>店铺风格:可勾选想要的店铺模块，主题搭配，按钮，自用定义模块内容</p>
    </div>
  ) 
}

const DesignPrompt = () => {
  return (
    <div className="prompt-dialog-modal">
      <h4>店铺设计</h4>
      <p>会根据勾选的模块，自定义:</p>
      <ul>
        <li>店铺Banner-控制页面Banner轮播展示</li>
        <li>店铺分组-控制页面分组类别展示</li>
        <li>店铺分区-控制首页分组下专题展示</li>
      </ul>
    </div>
  )
}

const ActivityPrompt = () => {
  return (
    <div className="prompt-dialog-modal">
      <h4>活动页面</h4>
      <p>支持多套活动模板，编辑完成后，可添加至各类Banner链接，开展各类活动。</p>
    </div>
  )
}

export default class BlockHead extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      modalStat: 0
    }
  }

  openModal = (id) => {
    this.setState({
      modalStat: id,
    })
  }

  cancelModal = () => {
    this.setState({
      modalStat: 0,
    })
  }

  render() {
    const { 
      leftText, 
      leftIcon, 
      rightText, 
      goBackBt, 
      savetBt, 
      addBt, 
      searchBt, 
      previewBt 
    } = this.props;
    const { modalStat } = this.state;
    return (
      <div className={styles.blockHead}>
        <div className={styles.blockHeadLeft}>
          {leftText ? <span>{leftText}</span> : null}
          {leftIcon ? <Icon type="question-circle-o" className={styles.icon} onClick={() => this.openModal(leftIcon)} /> : null}
        </div>
        <div className={styles.blockHeadRight}>
          {rightText ? <a onClick={() => router.push(rightText.src)}>{rightText.text}</a> : null}
          {goBackBt ? <Button className={styles.bt} onClick={goBackBt}>返回</Button> : null}
          {previewBt ? <Button className={styles.bt} type="primary" onClick={previewBt}>预览</Button> : null}
          {savetBt ? <Button className={styles.bt} type="primary" onClick={savetBt.event}>{savetBt.text}</Button> : null}
          {addBt ? <Button className={styles.bt} type="primary" onClick={addBt}>添加</Button> : null}
          {searchBt ? <Button className={styles.bt} type="primary" onClick={searchBt}>搜索</Button> : null}
        </div>
        <Modal
          title="提示"
          visible={modalStat!==0}
          onCancel={this.cancelModal}
          footer={[
            <Button type="primary" onClick={this.cancelModal}>知道了</Button>,
          ]}
        >
          {modalStat === 1 ? <ThemePrompt /> : modalStat === 2 ? <DesignPrompt /> : modalStat === 3 ? <ActivityPrompt /> : null}
        </Modal> 
      </div>
    );
  }
}
