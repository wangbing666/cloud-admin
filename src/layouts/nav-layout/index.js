import React, { Component } from 'react';
import { Layout } from 'antd';
import { Helmet } from 'react-helmet';
// import NProgress from 'nprogress';
import SiderMenu from '../../components/SiderMenu/SiderMenu';
import logo from '../../assets/images/logo.png';
import GlobalHeader from '../../components/GlobalHeader';
// import MenuData from '../../constants/menu';
import Utils from '../../utils';
import getMenu from '../../constants/api';
import MainHead from '../../components/MainHead/index';

// let lastHref;
const { Content, Header } = Layout;
// const href = Window.location;
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!Utils.isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

class NavLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      menu: [],
    };
  }

  componentWillMount() {
    /* eslint-disable */
    const data = {
      bussId: sessionStorage.getItem('shopId') || '',
      bussType: 2,
      userId: sessionStorage.getItem('userId') || ''
    }
    const menu = [];
    getMenu(data).then((res) => {
      if (res.status === 0 && res.body && res.body.function && res.body.function.length > 0) {
        let list = res.body.function;
        let keys = this.getMenuFormatter(list)
        this.setState({
          menu: keys,
        })
      }
      console.log(res)
    }).catch((err) => {
      console.log(err);
    })
  }

  getMenuFormatter(list) {
    let keys = [];
    list.forEach((item, i) => {
      keys.push({ name: item.functionName, icon: item.icon, path: item.url, children: [] });
      if (item.childList) {
        item.childList.forEach((child, j) => {
          keys[i].children.push({ name: child.functionName, path: child.url })
        })
      }
    });
    return keys;
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      // window.scrollTo(0, 0);
    }
  }
  render() {
    const getMenuData = () => formatter(this.state.menu);
    const { children, location } = this.props;
    const { collapsed, menu } = this.state;
    const childPath = this.props.location.pathname.split('/')[2];
    return (
      <Layout>
        <Helmet>
          <title>电商商户后台-上海点宝网络</title>
        </Helmet>
        <Header style={{ padding: 0, height: 100, marginBottom: 5 }}>
          <GlobalHeader
            logo={logo}
            currentUser={{
              name: 'Serati Ma',
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
              userid: '00000001',
              notifyCount: 12,
            }}
          />
        </Header>
        <Layout>
          {menu.length > 0 ? <SiderMenu
            logo={logo}
            collapsed={collapsed}
            menuData={getMenuData()}
            location={location}
            onCollapse={this.handleMenuCollapse}
            getChildName={name => this.getChildName(name)}
          /> : null}
          <Content style={{ height: '100%' }}>
            <MainHead childPath={childPath} />
            <div style={{ margin: '24px 24px 50px', minWidth: 900 }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default NavLayout;
