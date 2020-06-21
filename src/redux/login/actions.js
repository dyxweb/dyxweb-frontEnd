export const routePath = path => (
  {
    type: 'route_path',
    path,
  }
)

export const changePermission = permission => (
  {
    type: 'change_permission',
    permission,
  }
)