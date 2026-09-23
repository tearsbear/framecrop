import { useEffect, useRef } from 'react'
import { renderCropPreview } from '../geometry/cropMapping'
import type { EditorState, Rect, Size, SourceImage } from '../geometry/types'

type CropPreviewProps = {
  image: HTMLImageElement | null
  source: SourceImage
  viewport: Size
  crop: Rect
  editor: EditorState
  revision: number
}

const output = { width: 480, height: 360 }

export function CropPreview({
  image,
  source,
  viewport,
  crop,
  editor,
  revision,
}: CropPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image || revision === 0) return
    const context = canvas.getContext('2d')
    if (!context) return

    renderCropPreview({
      context,
      image,
      source,
      viewport,
      crop,
      rotation: editor.rotation,
      zoom: editor.zoom,
      pan: editor.pan,
      output,
    })
  }, [crop, editor, image, revision, source, viewport])

  return (
    <section className="preview-card" aria-labelledby="preview-heading">
      <div className="section-heading">
        <h2 id="preview-heading">Crop preview</h2>
        <span>480 × 360</span>
      </div>
      {revision === 0 ? (
        <p className="preview-empty">Press Preview Crop to render the current frame.</p>
      ) : null}
      <canvas
        ref={canvasRef}
        className={revision === 0 ? 'preview-canvas is-empty' : 'preview-canvas'}
        width={output.width}
        height={output.height}
        aria-label="Rendered crop output"
      />
    </section>
  )
}
