import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  
});

window.g_app = app;
app.use(createLoading());

app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/models/app.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/activity-management/models/activityDetailModels.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/activity-management/models/activityListModels.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/goods-management/models/goodsEditModels.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/goods-management/models/goodsModels.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/group-management/models/group.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/order-management/models/detailModels.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/order-management/models/listModels.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/retail-shop/models/models.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/sales-order/models/detailModels.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/sales-order/models/listModels.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/business/shop-decoration/models/shop.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/employees/department-management/models/models.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/employees/logger/models/index.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/home/models/models.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/login/models/user.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/register/models/index.js').default) });
app.model({ ...(require('/Users/wangbing/project/unspay/cloud-admin/src/pages/setting/user-info/models/index.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
