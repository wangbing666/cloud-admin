import React from 'react';
import { connect } from 'dva';
import { Upload, Icon, Modal, Form, Input, message } from 'antd';
import styles from './upload.less';
import { uploadList } from 'utils';

const FormItem = Form.Item;

const Banner = (props) => {
  const { dragStart, dragOver, dragEnd, fileList, onDelete } = props;
  return (
    <ul className={styles.itemList} id="banner" onDragStart={dragStart} onDragOver={dragOver} onDragEnd={dragEnd}>
      {fileList.map((e, index) => {
        return <li className={styles.bannerItem} id={index} style={{ backgroundImage: `url(${e.hostUrl}${e.fileUrl})` }} draggable={true} key={index}><Icon type="close-circle" theme="outlined" onClick={() => onDelete(index)} /></li>
      })}
    </ul>
  )
}

class UploadList extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    start: null,
    over: null,
    uploadList: [],
  };

  componentDidMount() {

  }


  dragStart(event) {
    const id = event.target.id;
    if (event.target.nodeName === 'LI') {
      this.setState({
        start: id,
      })
    }
  }

  dragOver = (event) => {
    const id = event.target.id;
    const { fileList } = this.props.goodsEditModel;
    if (event.target.nodeName === 'LI') {
      if (this.state.start !== id && this.state.over !== (fileList.length - 1)) {
        this.setState({
          over: id,
        })
      }
    }
  }

  dragEnd = (event) => {
    const { dispatch, goodsEditModel } = this.props;
    const { fileList } = goodsEditModel;
    if (event.target.nodeName === 'LI') {
      const node = event.target.parentNode.id;
      const allEle = Array.from(event.target.parentNode.querySelectorAll('li'));
      const start = this.state.start;
      const over = this.state.over;
      if (start !== null && over !== null && start !== (allEle.length - 1)) {
        let targetData = fileList[start];
        fileList.splice(start, 1);
        fileList.splice(over, 0, targetData);
        // this.setState({
        //   fileList: fileList
        // })
        dispatch({
          type: 'goodsEditModel/setUploadList',
          payload: {
            fileList
          },
        });
      }
    }
  }

  onChangUpload = (e) => {
    const { dispatch, goodsEditModel } = this.props
    const { fileList } = this.props.goodsEditModel;
    const files = e.target.files;
    if (files.length > 9) {
      message.warning('您最多只能上传9张图片');
      return;
    }
    dispatch({
      type: 'goodsEditModel/showListLoadding',
    })
    uploadList(files, {
      width: 200,
      height: 200,
      originHeight: 300,
      originWidth: 300,
    }).then((res) => {
      dispatch({
        type: 'goodsEditModel/hideListLoadding',
      })
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          if (fileList.length < 9) {
            fileList.push({ fileId: res[i].fileId, hostUrl: res[i].hostUrl, fileUrl: res[i].fileUrl })
          }
        }
        this.refs.file.input.value = ''; // 图片上传成功后置空input,便于再次上传同样的图片
        dispatch({ // 保存上传的图片地址
          type: 'goodsEditModel/setUploadList',
          payload: {
            fileList: fileList
          },
        });
      }
    }).catch((err) => {
      dispatch({
        type: 'goodsEditModel/hideListLoadding',
      })
      console.log(err)
    })
  }

  // 删除单个图片
  onDelete = (e) => {
    const { dispatch, goodsEditModel } = this.props;
    const { fileList } = goodsEditModel;
    fileList.splice(e, 1)
    dispatch({
      type: 'goodsEditModel/setSepList',
      payload: {
        fileList,
      },
    });
  }

  render() {
    const { fileList } = this.props.goodsEditModel;
    const params = {
      dragStart: this.dragStart.bind(this),
      dragOver: this.dragOver.bind(this),
      dragEnd: this.dragEnd.bind(this),
      onDelete: this.onDelete.bind(this),
      fileList: fileList,
    }

    const uploadButton = (
      <div className={styles.upload_img}>
        <Input ref="file" type="file" multiple style={{ opacity: 0 }} onChange={this.onChangUpload} accept="image/*"/>
        <div style={{ paddingTop: '26px' }}>
          <Icon type="plus" style={{ fontSize: '40px', lineHeight: '40px' }} />
          <div>
            <a href="javascript:;">上传图片</a>
          </div>
        </div>
      </div>
    );

    return (
      <div className="clearfix">
        < Banner {...params} />
        {fileList.length < 9 ?
          <div style={{ float: 'left', marginTop: '-15px' }}>
            {uploadButton}
          </div>
          : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

export default connect(mapStateToProps)(UploadList)