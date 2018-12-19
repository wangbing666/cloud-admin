/* eslint-disable */
const ENV = process.env.env; // 当前运行环境 dev为开发环境，sit为测试环境，uat为预发布环境,prod为正式环境
const hostDev = 'http://192.168.9.41'; // 测试环境

const hostPrd = 'http://admin.wedo77.com'; // 生产环境公共模块地址
const hostCloudPrd = 'http://cloud.wedo77.com'; // 生产环境云仓地址
const upLoadProd = '//res.wedo77.com'; // 生产上传文件本地服务器

const hostUat = 'http://admin.weidu7.com'; // 预发布环境公共模块地址
const hostCloudUat = 'http://cloud.weidu7.com'; // 预发布环境云仓地址
const upLoadUat = '//res.weidu7.com'; // 预发布上传文件本地服务器

var API, commonAPI, BASE_URL, LINK_URL, UPL_API;

switch (ENV) {
  case 'dev':
    API = 'cloud-admin/';
    commonAPI = 'commonModule/';
    BASE_URL = hostDev;
    LINK_URL = hostDev;
    UPL_API = '//192.168.9.81';
    break;
  case 'sit':
    API = `${hostDev}/cloud-admin/`;
    commonAPI = `${hostDev}/commonModule/`;
    BASE_URL = hostDev;
    LINK_URL = hostDev;
    UPL_API = '//192.168.9.81';
    break;
  case 'uat':
    API = `${hostCloudUat}/cloud-admin/`;
    commonAPI = `${hostUat}/commonModule/`;
    BASE_URL = hostUat;
    LINK_URL = hostCloudUat;
    UPL_API = upLoadUat;
    break;
  default:
    API = `${hostCloudPrd}/cloud-admin/`;
    commonAPI = `${hostPrd}/commonModule/`;
    BASE_URL = hostPrd;
    LINK_URL = hostPrd;
    UPL_API = upLoadProd;
    break;
}

module.exports = {
  API: API,
  commonAPI: commonAPI,
  BASE_URL: BASE_URL,
  LINK_URL: LINK_URL,
  UPL_API: UPL_API,
};
