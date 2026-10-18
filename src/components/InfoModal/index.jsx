import './index.scss'

/**
 * 规则说明弹窗
 */
export default function InfoModal({ visible, title, content, onClose }) {
  if (!visible) return null

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div
        className="info-modal-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="info-modal-title">{title}</span>
        <span className="info-modal-content">{content}</span>
        <button type="button" className="info-modal-confirm" onClick={onClose}>
          知道了
        </button>
      </div>
    </div>
  )
}
