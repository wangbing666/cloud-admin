/* eslint no-useless-escape:0 */
import config from './config';
import request from './request';
import { uploadQiniu, uploadList } from './upload';
import authorization from './authorization';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export default {
  urlToList: (url) => {
    const urllist = url.split('/').filter(i => i);
    return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
  },
  isUrl: path => reg.test(path),
};

// 验证图片格式-统一
const checkImgType = (type) => {
  const status = type === 'image/jpeg' || type === 'image/png' || type === 'image/gif' || type === 'image/jpg' || type === 'image/bmp';
  return status;
};

export {
  config,
  request,
  uploadQiniu,
  uploadList,
  authorization,
  checkImgType,
};
