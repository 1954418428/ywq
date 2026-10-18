import './index.scss'

/**
 * 顶部抽屉式选择面板（省份筛选 / 录入页省份选择）
 */
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
    <div className="selection-modal-overlay" role="dialog" aria-modal="true">
      <div className="selection-modal-backdrop" onClick={onClose} />
      <div className="selection-modal-panel">
        <div className="selection-modal-header">
          <span className="selection-modal-heading">{title}</span>
          <button type="button" className="selection-modal-close" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="selection-modal-list">
          <div className="selection-modal-grid">
            {options.map((option) => (
              <button
                type="button"
                key={option.value === null ? 'all' : option.value}
                className={`selection-modal-option${value === option.value ? ' selection-modal-option-active' : ''}`}
                onClick={() => {
                  onSelect(option.value)
                  onClose()
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
