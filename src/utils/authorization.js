import MD5 from 'md5';

export default {
  getUserInfo() {
    /* eslint-disable */
    const shopId = sessionStorage.getItem('shopId') || '';
    const userId = sessionStorage.getItem('userId') || '';
    const enterpriseId = sessionStorage.getItem('enterpriseId') || '';
    const walletId = sessionStorage.getItem('walletId') || '';
    const commonModuleInfo = JSON.parse(sessionStorage.getItem('commonModuleInfo' || {})) || {};
    /* eslint-disable */
    return {
      shopId: shopId,
      userId: userId,
      enterpriseId: enterpriseId,
      walletId: walletId,
      commonModuleInfo,
    }
  },
  exit() {
    const userInfo = this.getUserInfo();
    const point = MD5(userInfo.userId);
    /* eslint-disable */
    localStorage.removeItem(point);// 清除指定客服
    sessionStorage.clear();
    /* eslint-disable */
  }
}
