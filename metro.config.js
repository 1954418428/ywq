/**
 * React Native（Expo）Metro 配置
 * taro build --type rn 通过 @tarojs/rn-runner 编译；本文件供 Expo 壳使用
 */
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// 如需自定义 resolver/transformer，参考 @tarojs/rn-supporter 文档
module.exports = config
