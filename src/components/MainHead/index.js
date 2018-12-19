/**
 * Created by Fanning
 */
import React, { PureComponent } from 'react';
import styles from './index.less';
import Menu from '../../constants/menu';

export default class HeadTitleOne extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      childTitle: '',
    };
  }
  render() {
    const { childPath } = this.props;
    Menu.forEach((e) => {
      e.children.forEach((j) => {
        if (j.path === childPath) {
          this.setState({
            childTitle: j.name,
          });
        }
      });
    });
    const { childTitle } = this.state;
    return (
      <div>
        {childTitle ? 
          <div>
            <div className={styles.walletHeadOne}>
              <div className={styles.walletHeadLeft}>
                <span>{childTitle}</span>
              </div>
            </div>
          </div>
         : null}
      </div>
    );
  }
}
