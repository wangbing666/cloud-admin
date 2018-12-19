import { request, config } from 'utils';

const { commonAPI } = config

const PATH = {
  DepartList: 'employee/getDeptListPagination', // 部门列表接口
  DeptList: '/employee/getDeptList', // 上级部门列表
  DeptDetail: 'employee/getDeptDetail', // 获取部门详情
  UpdateDept: 'employee/saveOrUpdateDept', // 新增或修改部门
  deleteDept: 'employee/deleteDept', // 删除部门
}

// 获取部门列表
export async function getDepartList(params) {
  params['public'] = 'public';
  return request(`${commonAPI}${PATH.DepartList}`, {
    method: 'POST',
    body: params,
  })
}

// 获取上级部门列表
export async function getDeptList(params) {
  params['public'] = 'public';
  return request(`${commonAPI}${PATH.DeptList}`, {
    method: 'POST',
    body: params,
  })
}

// 获取部门详情
export async function getDeptDetail(params) {
  params['public'] = 'public';
  return request(`${commonAPI}${PATH.DeptDetail}`, {
    method: 'POST',
    body: params,
  })
}

// 新增或修改部门
export async function saveOrUpdateDept(params) {
  params['public'] = 'public';
  return request(`${commonAPI}${PATH.UpdateDept}`, {
    method: 'POST',
    body: params,
  })
}

// 删除部门
export async function getDeleteDept(params) {
  params['public'] = 'public';
  return request(`${commonAPI}${PATH.deleteDept}`, {
    method: 'POST',
    body: params,
  })
}