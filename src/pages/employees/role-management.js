import React, {PureComponent} from 'react';
import { config } from 'utils';
class roleManage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      windowHeight: null,
    };
  }

  componentDidMount() {
    window.addEventListener('message', (e) => {
      this.setState({
        windowHeight: `${e.data}px`,
      });
    }, false);
  }

  iframeOnLoad = () => {
    const userInfoData = JSON.parse(sessionStorage.getItem('operaterUserInfo'));
    let userInfo = null;
    userInfo = userInfoData ? userInfoData.userId : 100000;
    this.iframe.contentWindow.postMessage(userInfo, '*');
  }
  
  render() {
    return (
      <div className="roleContainer" >
        <iframe
          src={`${config.BASE_URL}/common-module#/role-list`}
          id="iframe"
          name="iframe"
          title="test"
          ref={(iframe) => { this.iframe = iframe; }}
          style={{ width: '100%', border: '0', height: this.state.windowHeight }}
          onLoad={this.iframeOnLoad}
        />
      </div>
    );
  }
}

export default roleManage;