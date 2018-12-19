import React from 'react';
import Editor from 'wangeditor';
import { connect } from 'dva';
import { uploadList } from 'utils';

import styles from '../../goods-edit/index.less';

class Editors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorContent: ''
    };
  }

  componentDidMount() {
    // const editor = new Editor('#editor')
    // editor.create()
    const { dispatch } = this.props;
    const elem = this.refs.editorElem
    const editor = new Editor(elem)
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.showLinkImg = false
    editor.customConfig.customUploadImg = function (files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      uploadList(files, {
        width: 200,
        height: 200,
        originHeight: 200,
        originWidth: 200,
      }).then(res => {
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            insert(res[i].hostUrl + res[i].fileUrl)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
    editor.customConfig.onchangeTimeout = 500

    editor.customConfig.onchange = html => {
      console.log(html)
      dispatch({
        type: 'goodsEditModel/setEditor',
        payload: {
          goodsEditor: html
        },
      });
    }
    editor.create()
    this.setState({
      editor
    })
  }

  clickHandle() {
    alert(this.state.editorContent)
  }

  render() {
    const { goodsEditor } = this.props.goodsEditModel
    const { editor } = this.state;
    if (editor) {
      editor.txt.html(goodsEditor)
    }
    return (
      <div>
        <div className={styles.goods_title}>
          <label>详细内容</label>
        </div>
        <div ref="editorElem" style={{ textAlign: 'left', maxWidth: '1180px', margin: 'auto' }}>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

export default connect(mapStateToProps)(Editors)