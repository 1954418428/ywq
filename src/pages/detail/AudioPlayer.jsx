import { useEffect, useRef, useState } from 'react'
import { View, Text, Slider } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { formatDuration } from '../../utils'
import './AudioPlayer.scss'

/** 模块级"当前播放器"，保证全局同时只有一个音频在播 */
let currentPlayer = null

/**
 * 自定义音频播放器（H5/RN 通用）
 * @param {object} props
 * @param {string} props.src    音频地址
 * @param {string} props.title  标题
 */
export default function AudioPlayer({ src, title }) {
  const ctxRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const ctx = Taro.createInnerAudioContext()
    ctx.src = src
    ctx.onTimeUpdate(() => {
      setCurrentTime(ctx.currentTime || 0)
      if (ctx.duration) setDuration(ctx.duration)
    })
    ctx.onEnded(() => {
      setPlaying(false)
      setCurrentTime(0)
    })
    ctx.onError(() => {
      setPlaying(false)
      Taro.showToast({ title: '音频加载失败', icon: 'none' })
    })
    ctxRef.current = ctx
    return () => {
      if (currentPlayer === ctx) currentPlayer = null
      ctx.destroy()
      ctxRef.current = null
    }
  }, [src])

  const toggle = () => {
    const ctx = ctxRef.current
    if (!ctx) return
    if (playing) {
      ctx.pause()
      setPlaying(false)
    } else {
      // 停掉其他正在播放的音频
      if (currentPlayer && currentPlayer !== ctx) currentPlayer.pause()
      currentPlayer = ctx
      ctx.play()
      setPlaying(true)
    }
  }

  const onSeek = (value) => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.seek(value)
    setCurrentTime(value)
  }

  const icon = playing ? '⏸' : '▶'

  return (
    <View className="audio-player">
      <View className="audio-toggle" onClick={toggle}>
        <Text className="audio-toggle-icon">{icon}</Text>
      </View>
      <View className="audio-body">
        <Text className="audio-title" numberOfLines={1}>
          {title}
        </Text>
        <View className="audio-progress-row">
          <Slider
            className="audio-slider"
            min={0}
            max={duration || 100}
            value={currentTime}
            activeColor="#4f6ef2"
            blockSize={20}
            onChange={(e) => onSeek(e.detail.value)}
          />
          <Text className="audio-time">
            {formatDuration(currentTime)}/{formatDuration(duration)}
          </Text>
        </View>
      </View>
    </View>
  )
}
