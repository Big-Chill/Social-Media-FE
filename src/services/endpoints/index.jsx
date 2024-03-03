import { getRequest, postRequest } from '../api/base';

export const AuthService = {
  login: (payload) => postRequest('user/login', payload),

  register: (payload) => postRequest('user/register', payload),

  logOut: () => getRequest('user/logout'),
}

export const PostService = {
  getPosts: (pageNo) => getRequest(`post?page=${pageNo}`),
}