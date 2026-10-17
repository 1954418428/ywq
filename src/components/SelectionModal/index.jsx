import { ScrollView, Text, View } from '@tarojs/components'
import './index.scss'

export default function SelectionModal({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose
}) {
  if (!visible) return null

  return (
    <View className="selection-modal-overlay">
      <View className="selection-modal-backdrop" onClick={onClose} />
      <View className="selection-modal-panel">
        <View className="selection-modal-header">
          <Text className="selection-modal-heading">{title}</Text>
          <Text className="selection-modal-close" onClick={onClose}>关闭</Text>
        </View>
        <ScrollView className="selection-modal-list" scrollY>
          <View className="selection-modal-grid">
            {options.map((option) => (
              <View
                key={option.value === null ? 'all' : option.value}
                className={`selection-modal-option ${value === option.value ? 'selection-modal-option-active' : ''}`}
                onClick={() => {
                  onSelect(option.value)
                  onClose()
                }}
              >
                <Text>{option.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
