import React, { PureComponent } from 'react';
import { Icon, Spin, Tag, Avatar, Divider } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
/* eslint-disable */
import Link from 'umi/link';
/* eslint-enable */
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import { authorization } from 'utils';
import router from 'umi/router';

export default class GlobalHeader extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  _exit() {
    authorization.exit();
    window.location.href = '/cloud-operator'; // 由于redux数据缓存，故使用此跳转，刷新页面
  }

  render() {
    const {
      currentUser = {},
      fetchingNotices,
      logo,
      onNoticeVisibleChange,
      onNoticeClear,
    } = this.props;
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="logo" />
        </Link>
        <Divider type="vertical" style={{ height: 52, margin: 0 }} />
        <span className={styles.title}>
          电商商户后台-上海点宝网络
        </span>
        <div className={styles.right}>
          {/* <NoticeIcon
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={noticeData['通知']}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['消息']}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['待办']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon> */}
          {currentUser.name ? (
            <span style={{ marginLeft: 24, marginRight: 32 }}>
              {/* <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                <span className={styles.name}>{currentUser.name}</span>
              </span> */}

              <span style={{ marginLeft: 44, marginRight: 10, cursor: 'pointer' }}>
                <Link to="/home" className={styles.link}>主页</Link>
              </span>
              <Divider type="vertical" style={{ height: 20, margin: 0 }} />
              <span style={{ marginRight: 44, marginLeft: 10, cursor: 'pointer' }}>
                <Link  className={styles.link} to="/login/select-ent">切换企业</Link>
              </span>
              <span style={{ cursor: 'pointer' }} onClick={this._exit}>
                <Icon type="poweroff" style={{ marginRight: 8 }} />退出
              </span>
            </span>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
