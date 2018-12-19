
export default [
  {
    name: '首页',
    icon: 'home',
    path: 'home',
    children: [],
  },
  {
    name: '业务管理',
    icon: 'mail',
    path: 'business',
    children: [
      {
        name: '店铺装修',
        path: 'shop-decoration',
      },
      {
        name: '分组管理',
        path: 'group-management',
      },
      {
        name: '商品管理',
        path: 'goods-management',
      },
      {
        name: '活动管理',
        path: 'activity-management',
      },
      {
        name: '订单管理',
        path: 'order-management',
      },
      {
        name: '售后订单',
        path: 'sales-order',
      },
      {
        name: '分销店管理',
        path: 'retail-shop',
      },
    ],
  },
  {
    name: '员工管理',
    icon: 'appstore',
    path: 'employees',
    children: [
      {
        name: '员工维护',
        path: 'employee-management',
      },
      {
        name: '部门列表',
        path: 'department-management',
      },
      {
        name: '角色管理',
        path: 'role-management',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: '操作日志',
        path: 'logger',
      },
    ],
  },
  {
    name: '设置',
    icon: 'setting',
    path: 'setting',
    children: [
      {
        name: '账号管理',
        path: 'user-info',
      },
    ],
  },
  {
    name: '接待管理',
    icon: 'customer-service',
    path: 'reception',
    children: [
      {
        name: '客服工作台',
        path: 'custom-service',
      },
      {
        name: '接待列表',
        path: 'recept-management',
      },
      {
        name: '客服设置',
        path: 'emergency-management',
      },
    ],
  },
];
