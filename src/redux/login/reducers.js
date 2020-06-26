const initState = {
  islogin: false,
  permission: 'noraml',
}

export const loginStore = (state = initState, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, islogin: true };
    case 'logout':
      return { ...state, islogin: false, permission: 'normal' };
    case 'change_permission':
      return { ...state, permission: action.permission };
    default:
      return state;
  }
}