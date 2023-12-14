import { getCookie } from 'utils/cookie';
const initState = {
  isLogin: Boolean(getCookie('islogin')),
  permission: '',
}

export const loginStore = (state = initState, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, isLogin: true };
    case 'logout':
      return { ...state, isLogin: false, permission: 'normal' };
    case 'change_permission':
      return { ...state, permission: action.permission };
    default:
      return state;
  }
}