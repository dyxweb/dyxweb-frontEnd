import { setCookie, getCookie } from 'utils/cookie';
const initState = {
  path: '/',
  islogin: Boolean(getCookie('islogin')),
  permission: 'noraml',
}

export const loginStore = (state = initState, action) => {
  switch (action.type) {
    case 'route_path':
      return { ...state, path: action.path };
    case 'login':
      setCookie("islogin", 1, 3);
      return { ...state, islogin: true };
    case 'logout':
      setCookie("islogin", 0, 3);
      return { ...state, islogin: false };
    case 'change_permission':
      return { ...state, permission: action.permission };
    default:
      return state;
  }
}