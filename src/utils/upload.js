/* eslint-disable */
import request from './request';
import config from './config';
import authorization from './authorization';

const { API } = config;
// 上传图片到七牛
export function uploadQiniu(params, options) {
  return request(`${API}upload/getVoucher`, {
    method: 'POST',
    body: `userId=${authorization.getUserInfo().userId}`
  })
    .then((res) => {
      if (res && res.status === 0 && res.body && res.body.uploadVoucher) {
        params.append('token', res.body.uploadVoucher);
        return request('//upload.qiniu.com', {
          method: 'POST',
          body: params,
        })
      }
    })
    .then((data) => {
      if (data && data.key && data.hash) {
        const files = {
          file: [{
            fileld: 0,
            fileSize: 0,
            fileType: options.type ? options.type : 0,
            fileUrl: data.key,
            frameOffset: 0,
            height: options.height,
            hostUrl: '',
            originHeight: options.originHeight,
            originWidth: options.originWidth,
            radioTime: 0,
            userId: authorization.getUserInfo().userId,
            width: options.width,
            zoomUrl: '',
          }],
          userId: authorization.getUserInfo().userId,
        };
        return request(`${API}upload/qiniuUpload`, {
          method: 'POST',
          body: files,
        });
      }
    })
}

// 多图上传
export async function uploadList(params, options) {
  const value = await request(`${API}upload/getVoucher`, {
    method: 'POST',
    body: `userId=${authorization.getUserInfo().userId}`
  })
  if (value && value.status === 0 && value.body && value.body.uploadVoucher) {
    let list = [], file = [];
    for (let i = 0; i < params.length; i++) {
      let myForm = new FormData();
      myForm.append('file', params[i])
      myForm.append('token', value.body.uploadVoucher);
      list.push(await request('//upload.qiniu.com', { method: 'POST', body: myForm }))
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i].key && list[i].hash) {
        file.push({
          fileld: 0,
          fileSize: 0,
          fileType: options.type ? options.type : 0,
          fileUrl: list[i].key,
          frameOffset: 0,
          height: options.height,
          hostUrl: '',
          originHeight: options.originHeight,
          originWidth: options.originWidth,
          radioTime: 0,
          userId: authorization.getUserInfo().userId,
          width: options.width,
          zoomUrl: '',
        })
      }
    }
    const files = {
      file: file,
      userId: authorization.getUserInfo().userId,
    }
    const fileList = await request(`${API}upload/qiniuUpload`, { method: 'POST', body: files });
    return fileList;
  }
}

