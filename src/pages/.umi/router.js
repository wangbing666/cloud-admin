import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import { routerRedux } from 'dva/router';



let Router = DefaultRouter;
const { ConnectedRouter } = routerRedux;
Router = ConnectedRouter;


let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/404",
        "exact": true,
        "component": require('../404.js').default
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default
      },
      {
        "path": "/business/activity-management/activity-edit/:index",
        "exact": true,
        "component": require('../business/activity-management/activity-edit/$index.js').default
      },
      {
        "path": "/business/activity-management",
        "exact": true,
        "component": require('../business/activity-management/index.js').default
      },
      {
        "path": "/business/goods-management",
        "exact": true,
        "component": require('../business/goods-management/index.js').default
      },
      {
        "path": "/business/goods-management/goods-edit/:index",
        "exact": true,
        "component": require('../business/goods-management/goods-edit/$index.js').default
      },
      {
        "path": "/business/goods-management/goods-preview/:index",
        "exact": true,
        "component": require('../business/goods-management/goods-preview/$index.js').default
      },
      {
        "path": "/business/group-management/edit-group",
        "exact": true,
        "component": require('../business/group-management/edit-group/index.js').default
      },
      {
        "path": "/business/group-management",
        "exact": true,
        "component": require('../business/group-management/index.js').default
      },
      {
        "path": "/business/order-management/order-detail/:index",
        "exact": true,
        "component": require('../business/order-management/order-detail/$index.js').default
      },
      {
        "path": "/business/order-management",
        "exact": true,
        "component": require('../business/order-management/index.js').default
      },
      {
        "path": "/business/retail-shop",
        "exact": true,
        "component": require('../business/retail-shop/index.js').default
      },
      {
        "path": "/business/sales-order/sales-order-detail/:index",
        "exact": true,
        "component": require('../business/sales-order/sales-order-detail/$index.js').default
      },
      {
        "path": "/business/sales-order",
        "exact": true,
        "component": require('../business/sales-order/index.js').default
      },
      {
        "path": "/business/shop-decoration",
        "exact": true,
        "component": require('../business/shop-decoration/index.js').default
      },
      {
        "path": "/business/shop-decoration/editPartition",
        "exact": true,
        "component": require('../business/shop-decoration/editPartition/index.js').default
      },
      {
        "path": "/business/shop-decoration/editShopBaseInfo",
        "exact": true,
        "component": require('../business/shop-decoration/editShopBaseInfo/index.js').default
      },
      {
        "path": "/business/shop-decoration/activity/edit/:index",
        "exact": true,
        "component": require('../business/shop-decoration/activity/edit/$index.js').default
      },
      {
        "path": "/business/shop-decoration/shopStyle",
        "exact": true,
        "component": require('../business/shop-decoration/shopStyle/index.js').default
      },
      {
        "path": "/employees/department-management/department-edit/:index",
        "exact": true,
        "component": require('../employees/department-management/department-edit/$index.js').default
      },
      {
        "path": "/employees/department-management",
        "exact": true,
        "component": require('../employees/department-management/index.js').default
      },
      {
        "path": "/employees/employee-management",
        "exact": true,
        "component": require('../employees/employee-management.js').default
      },
      {
        "path": "/employees/logger",
        "exact": true,
        "component": require('../employees/logger/index.js').default
      },
      {
        "path": "/employees/role-management",
        "exact": true,
        "component": require('../employees/role-management.js').default
      },
      {
        "path": "/home",
        "exact": true,
        "component": require('../home/index.js').default
      },
      {
        "path": "/home/specical",
        "exact": true,
        "component": require('../home/specical/index.js').default
      },
      {
        "path": "/login",
        "exact": true,
        "component": require('../login/index.js').default
      },
      {
        "path": "/login/select-ent",
        "exact": true,
        "component": require('../login/select-ent.js').default
      },
      {
        "path": "/reception/custom-service",
        "exact": true,
        "component": require('../reception/custom-service/index.js').default
      },
      {
        "path": "/reception/emergency-management",
        "exact": true,
        "component": require('../reception/emergency-management.js').default
      },
      {
        "path": "/reception/recept-management",
        "exact": true,
        "component": require('../reception/recept-management.js').default
      },
      {
        "path": "/register/disable",
        "exact": true,
        "component": require('../register/disable/index.js').default
      },
      {
        "path": "/register",
        "exact": true,
        "component": require('../register/index.js').default
      },
      {
        "path": "/setting/user-info/change-manager",
        "exact": true,
        "component": require('../setting/user-info/change-manager.js').default
      },
      {
        "path": "/setting/user-info/enterprise-datum",
        "exact": true,
        "component": require('../setting/user-info/enterprise-datum.js').default
      },
      {
        "path": "/setting/user-info",
        "exact": true,
        "component": require('../setting/user-info/index.js').default
      },
      {
        "component": () => React.createElement(require('/Users/wangbing/project/unspay/cloud-admin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', routes: '[{"path":"/","component":"./src/layouts/index.js","routes":[{"path":"/404","exact":true,"component":"./src/pages/404.js"},{"path":"/","exact":true,"component":"./src/pages/index.js"},{"path":"/business/activity-management/activity-edit/:index","exact":true,"component":"./src/pages/business/activity-management/activity-edit/$index.js"},{"path":"/business/activity-management/components/activity-edit/activityGoods","exact":true,"component":"./src/pages/business/activity-management/components/activity-edit/activityGoods.js"},{"path":"/business/activity-management/components/activity-edit/activityInfo","exact":true,"component":"./src/pages/business/activity-management/components/activity-edit/activityInfo.js"},{"path":"/business/activity-management/components/activity-list/activitySearch","exact":true,"component":"./src/pages/business/activity-management/components/activity-list/activitySearch.js"},{"path":"/business/activity-management/components","exact":true,"component":"./src/pages/business/activity-management/components/index.js"},{"path":"/business/activity-management","exact":true,"component":"./src/pages/business/activity-management/index.js"},{"path":"/business/activity-management/models/activityDetailModels","exact":true,"component":"./src/pages/business/activity-management/models/activityDetailModels.js"},{"path":"/business/activity-management/models/activityListModels","exact":true,"component":"./src/pages/business/activity-management/models/activityListModels.js"},{"path":"/business/activity-management/services/services","exact":true,"component":"./src/pages/business/activity-management/services/services.js"},{"path":"/business/goods-management/components","exact":true,"component":"./src/pages/business/goods-management/components/index.js"},{"path":"/business/goods-management","exact":true,"component":"./src/pages/business/goods-management/index.js"},{"path":"/business/goods-management/components/goods-edit/grouping","exact":true,"component":"./src/pages/business/goods-management/components/goods-edit/grouping.js"},{"path":"/business/goods-management/components/goods-edit/otherInfo","exact":true,"component":"./src/pages/business/goods-management/components/goods-edit/otherInfo.js"},{"path":"/business/goods-management/components/goods-edit/priceRepertory","exact":true,"component":"./src/pages/business/goods-management/components/goods-edit/priceRepertory.js"},{"path":"/business/goods-management/components/goods-edit/specifications","exact":true,"component":"./src/pages/business/goods-management/components/goods-edit/specifications.js"},{"path":"/business/goods-management/components/goods-edit/upload","exact":true,"component":"./src/pages/business/goods-management/components/goods-edit/upload.js"},{"path":"/business/goods-management/components/goods-list/search","exact":true,"component":"./src/pages/business/goods-management/components/goods-list/search.js"},{"path":"/business/goods-management/components/goods-edit/goodsInfo","exact":true,"component":"./src/pages/business/goods-management/components/goods-edit/goodsInfo.js"},{"path":"/business/goods-management/goods-edit/:index","exact":true,"component":"./src/pages/business/goods-management/goods-edit/$index.js"},{"path":"/business/goods-management/goods-preview/:index","exact":true,"component":"./src/pages/business/goods-management/goods-preview/$index.js"},{"path":"/business/goods-management/components/goods-edit/editor","exact":true,"component":"./src/pages/business/goods-management/components/goods-edit/editor.js"},{"path":"/business/goods-management/models/goodsEditModels","exact":true,"component":"./src/pages/business/goods-management/models/goodsEditModels.js"},{"path":"/business/goods-management/models/goodsModels","exact":true,"component":"./src/pages/business/goods-management/models/goodsModels.js"},{"path":"/business/goods-management/services/goodServices","exact":true,"component":"./src/pages/business/goods-management/services/goodServices.js"},{"path":"/business/goods-management/services/goodsEditServices","exact":true,"component":"./src/pages/business/goods-management/services/goodsEditServices.js"},{"path":"/business/group-management/api","exact":true,"component":"./src/pages/business/group-management/api/index.js"},{"path":"/business/group-management/edit-group","exact":true,"component":"./src/pages/business/group-management/edit-group/index.js"},{"path":"/business/group-management","exact":true,"component":"./src/pages/business/group-management/index.js"},{"path":"/business/group-management/models/group","exact":true,"component":"./src/pages/business/group-management/models/group.js"},{"path":"/business/order-management/components","exact":true,"component":"./src/pages/business/order-management/components/index.js"},{"path":"/business/order-management/services/listServices","exact":true,"component":"./src/pages/business/order-management/services/listServices.js"},{"path":"/business/order-management/components/order-list/order-search","exact":true,"component":"./src/pages/business/order-management/components/order-list/order-search.js"},{"path":"/business/order-management/components/order-list/order-table","exact":true,"component":"./src/pages/business/order-management/components/order-list/order-table.js"},{"path":"/business/order-management/components/order-list/show-logistics","exact":true,"component":"./src/pages/business/order-management/components/order-list/show-logistics.js"},{"path":"/business/activity-management/components/activity-edit/activityBill","exact":true,"component":"./src/pages/business/activity-management/components/activity-edit/activityBill.js"},{"path":"/business/order-management/models/detailModels","exact":true,"component":"./src/pages/business/order-management/models/detailModels.js"},{"path":"/business/order-management/models/listModels","exact":true,"component":"./src/pages/business/order-management/models/listModels.js"},{"path":"/business/order-management/order-detail/:index","exact":true,"component":"./src/pages/business/order-management/order-detail/$index.js"},{"path":"/business/order-management/services/detailServices","exact":true,"component":"./src/pages/business/order-management/services/detailServices.js"},{"path":"/business/order-management","exact":true,"component":"./src/pages/business/order-management/index.js"},{"path":"/business/retail-shop","exact":true,"component":"./src/pages/business/retail-shop/index.js"},{"path":"/business/retail-shop/models/models","exact":true,"component":"./src/pages/business/retail-shop/models/models.js"},{"path":"/business/retail-shop/services/services","exact":true,"component":"./src/pages/business/retail-shop/services/services.js"},{"path":"/business/sales-order/components","exact":true,"component":"./src/pages/business/sales-order/components/index.js"},{"path":"/business/sales-order/services/listServices","exact":true,"component":"./src/pages/business/sales-order/services/listServices.js"},{"path":"/business/sales-order/components/sales-order-detail/confirm-goods","exact":true,"component":"./src/pages/business/sales-order/components/sales-order-detail/confirm-goods.js"},{"path":"/business/sales-order/components/sales-order-detail/refund-failure","exact":true,"component":"./src/pages/business/sales-order/components/sales-order-detail/refund-failure.js"},{"path":"/business/sales-order/components/sales-order-detail/refund-success","exact":true,"component":"./src/pages/business/sales-order/components/sales-order-detail/refund-success.js"},{"path":"/business/sales-order/components/sales-order-list/order-search","exact":true,"component":"./src/pages/business/sales-order/components/sales-order-list/order-search.js"},{"path":"/business/order-management/components/order-detail/goods-delivery","exact":true,"component":"./src/pages/business/order-management/components/order-detail/goods-delivery.js"},{"path":"/business/sales-order/models/detailModels","exact":true,"component":"./src/pages/business/sales-order/models/detailModels.js"},{"path":"/business/sales-order/models/listModels","exact":true,"component":"./src/pages/business/sales-order/models/listModels.js"},{"path":"/business/sales-order/sales-order-detail/:index","exact":true,"component":"./src/pages/business/sales-order/sales-order-detail/$index.js"},{"path":"/business/sales-order/services/detailServices","exact":true,"component":"./src/pages/business/sales-order/services/detailServices.js"},{"path":"/business/sales-order","exact":true,"component":"./src/pages/business/sales-order/index.js"},{"path":"/business/shop-decoration/components/preview","exact":true,"component":"./src/pages/business/shop-decoration/components/preview/index.js"},{"path":"/business/shop-decoration","exact":true,"component":"./src/pages/business/shop-decoration/index.js"},{"path":"/business/shop-decoration/components/activity/activityPre","exact":true,"component":"./src/pages/business/shop-decoration/components/activity/activityPre.js"},{"path":"/business/shop-decoration/components/activity","exact":true,"component":"./src/pages/business/shop-decoration/components/activity.js"},{"path":"/business/shop-decoration/components/addGoods","exact":true,"component":"./src/pages/business/shop-decoration/components/addGoods/index.js"},{"path":"/business/shop-decoration/components/baseInfo","exact":true,"component":"./src/pages/business/shop-decoration/components/baseInfo.js"},{"path":"/business/shop-decoration/components/blockHead","exact":true,"component":"./src/pages/business/shop-decoration/components/blockHead/index.js"},{"path":"/business/shop-decoration/api","exact":true,"component":"./src/pages/business/shop-decoration/api/index.js"},{"path":"/business/shop-decoration/components/shopDesign","exact":true,"component":"./src/pages/business/shop-decoration/components/shopDesign.js"},{"path":"/business/shop-decoration/components/shopStyle","exact":true,"component":"./src/pages/business/shop-decoration/components/shopStyle.js"},{"path":"/business/shop-decoration/editPartition","exact":true,"component":"./src/pages/business/shop-decoration/editPartition/index.js"},{"path":"/business/shop-decoration/editShopBaseInfo","exact":true,"component":"./src/pages/business/shop-decoration/editShopBaseInfo/index.js"},{"path":"/business/shop-decoration/activity/edit/:index","exact":true,"component":"./src/pages/business/shop-decoration/activity/edit/$index.js"},{"path":"/business/shop-decoration/models/shop","exact":true,"component":"./src/pages/business/shop-decoration/models/shop.js"},{"path":"/business/shop-decoration/shopStyle","exact":true,"component":"./src/pages/business/shop-decoration/shopStyle/index.js"},{"path":"/employees/department-management/department-edit/:index","exact":true,"component":"./src/pages/employees/department-management/department-edit/$index.js"},{"path":"/employees/department-management","exact":true,"component":"./src/pages/employees/department-management/index.js"},{"path":"/employees/department-management/models/models","exact":true,"component":"./src/pages/employees/department-management/models/models.js"},{"path":"/employees/department-management/services/services","exact":true,"component":"./src/pages/employees/department-management/services/services.js"},{"path":"/employees/employee-management","exact":true,"component":"./src/pages/employees/employee-management.js"},{"path":"/employees/logger/api","exact":true,"component":"./src/pages/employees/logger/api/index.js"},{"path":"/employees/logger","exact":true,"component":"./src/pages/employees/logger/index.js"},{"path":"/employees/logger/models","exact":true,"component":"./src/pages/employees/logger/models/index.js"},{"path":"/employees/role-management","exact":true,"component":"./src/pages/employees/role-management.js"},{"path":"/home","exact":true,"component":"./src/pages/home/index.js"},{"path":"/home/models/models","exact":true,"component":"./src/pages/home/models/models.js"},{"path":"/home/services/services","exact":true,"component":"./src/pages/home/services/services.js"},{"path":"/home/specical","exact":true,"component":"./src/pages/home/specical/index.js"},{"path":"/setting/user-info/models","exact":true,"component":"./src/pages/setting/user-info/models/index.js"},{"path":"/login/api","exact":true,"component":"./src/pages/login/api/index.js"},{"path":"/login","exact":true,"component":"./src/pages/login/index.js"},{"path":"/login/models/user","exact":true,"component":"./src/pages/login/models/user.js"},{"path":"/login/select-ent","exact":true,"component":"./src/pages/login/select-ent.js"},{"path":"/reception/custom-service/api","exact":true,"component":"./src/pages/reception/custom-service/api/index.js"},{"path":"/reception/custom-service","exact":true,"component":"./src/pages/reception/custom-service/index.js"},{"path":"/reception/emergency-management","exact":true,"component":"./src/pages/reception/emergency-management.js"},{"path":"/reception/recept-management","exact":true,"component":"./src/pages/reception/recept-management.js"},{"path":"/register/api","exact":true,"component":"./src/pages/register/api/index.js"},{"path":"/register/disable","exact":true,"component":"./src/pages/register/disable/index.js"},{"path":"/register","exact":true,"component":"./src/pages/register/index.js"},{"path":"/register/models","exact":true,"component":"./src/pages/register/models/index.js"},{"path":"/setting/user-info/api","exact":true,"component":"./src/pages/setting/user-info/api/index.js"},{"path":"/setting/user-info/change-manager","exact":true,"component":"./src/pages/setting/user-info/change-manager.js"},{"path":"/setting/user-info/enterprise-datum","exact":true,"component":"./src/pages/setting/user-info/enterprise-datum.js"},{"path":"/setting/user-info","exact":true,"component":"./src/pages/setting/user-info/index.js"},{"path":"/business/sales-order/components/sales-order-detail/apply-refund","exact":true,"component":"./src/pages/business/sales-order/components/sales-order-detail/apply-refund.js"}]}]' })
      }
    ]
  }
];


export default function() {
  return (
<Router history={window.g_history}>
  <Route render={({ location }) =>
    renderRoutes(routes, {}, { location })
  } />
</Router>
  );
}
