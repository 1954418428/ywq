import { Text, View } from '@tarojs/components'
import './index.scss'

export default function InfoModal({ visible, title, content, onClose }) {
  if (!visible) return null

  return (
    <View className="info-modal-overlay" onClick={onClose}>
      <View className="info-modal-dialog" onClick={(event) => event.stopPropagation()}>
        <Text className="info-modal-title">{title}</Text>
        <Text className="info-modal-content">{content}</Text>
        <Text className="info-modal-confirm" onClick={onClose}>知道了</Text>
      </View>
    </View>
  )
}
