
import { request, config } from '../utils';

const { commonAPI } = config;
/* eslint-disable */
export default async function getMenu(params) {
  return request(`${commonAPI}function/getFunctionList`, {
    method: 'POST',
    body: params,
  });
}

