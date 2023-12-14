/**
 * 面试技术点相关的menu配置
 */
const mdData = require.context('../../md/interview', true, /\.md$/)
const menuConfig = []

// 根据目录动态生成导航数据
mdData.keys().forEach(item => {
  const itemArr = item.split('/')
  if (itemArr.length === 3) {
    const firstKey = itemArr[1]
    const secondKey = itemArr[2].replace('.md', '')
    const findIndex = menuConfig.findIndex(item1 => item1.key === firstKey)
    if (findIndex > -1) {
      menuConfig[findIndex].submenu.push({ key: `/interview/${firstKey}/${secondKey}`, label: secondKey })
    } else {
      menuConfig.push({ key: firstKey, label: firstKey , submenu: [{ key: `/interview/${firstKey}/${secondKey}`, label: secondKey }]})
    }
  }
})

export default menuConfig;