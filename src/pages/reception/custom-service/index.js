import { Component } from "react";
import styles from './index.less';
import { getFunctionList } from './api/index';
import { authorization } from 'utils';
import { Spin, Button } from 'antd';
import MD5 from "md5";

const { getUserInfo } = authorization;

class CustomService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderStat: false,
      targetUrl: '',
      targetView: '',
    }
  }

  componentDidMount() {

    const userInfo = getUserInfo();
    const params = {
      userId: userInfo.userId,
      bussId: userInfo.shopId,
      bussType: 2
    }
    getFunctionList(params).then((data) => {
      if (data && data.status === 0) {
        const menu = data.body.function;
        menu.forEach(element => {
          const point = MD5(userInfo.userId);
          this.setState({
            renderStat: true,
            targetUrl: `//${window.location.hostname}/cloud-reception/#/home?point=${point}`,
            targetView: `view_${point}`,
          })
          /* eslint-disable */
          document.domain = window.location.hostname;
          localStorage.setItem(point, JSON.stringify({
            userId: userInfo.userId,
            shopId: userInfo.shopId,
            enterpriseId: userInfo.enterpriseId,
          }));
          /* eslint-disable */
        });
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {
    const { renderStat, targetUrl, targetView } = this.state;

    return (
      <div className={styles.container}>
        {
          !renderStat ? <Spin size="large" /> : <a href={targetUrl} target={targetView}><Button type="primary">进入客服系统</Button></a>
        }

      </div>
    )
  }
}

export default CustomService;
