import { useEffect, useId, useRef } from 'react'
export default function Modal({ open, title, onClose, children }) {
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    ref.current?.querySelector('input, button, select, textarea')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') { // keep focus inside the dialog
        const els = ref.current.querySelectorAll('button, input, select, textarea, [href]')
        const first = els[0], last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl dark:bg-night-800 sm:max-w-md sm:rounded-2xl">
        <h2 id={titleId} className="mb-4 font-display text-xl">{title}</h2>
        {children}
      </div>
    </div>
  )
}
