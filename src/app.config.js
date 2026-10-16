/* 应用入口页 */
export default {
  pages: ['pages/index/index', 'pages/activity/index', 'pages/detail/index'],
  tabBar: {
    color: '#7f8c9b',
    selectedColor: '#4f6ef2',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/activity/index',
        text: '活动',
        iconPath: './assets/tabbar/activity.png',
        selectedIconPath: './assets/tabbar/activity-active.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '人物展示',
    navigationBarTextStyle: 'black'
  }
}
