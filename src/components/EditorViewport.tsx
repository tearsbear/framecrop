import { getEffectiveScale } from '../geometry/fit'
import { getPanLimits } from '../geometry/constraints'
import { usePanGesture } from '../hooks/usePanGesture'
import type { EditorState, Rect, Size, SourceImage } from '../geometry/types'

type EditorViewportProps = {
  imageSrc: string
  source: SourceImage
  viewport: Size
  crop: Rect
  editor: EditorState
  onPan: (pan: EditorState['pan']) => void
  onImageLoad: (image: HTMLImageElement) => void
  onImageError: () => void
}

export function EditorViewport({
  imageSrc,
  source,
  viewport,
  crop,
  editor,
  onPan,
  onImageLoad,
  onImageError,
}: EditorViewportProps) {
  const scale = getEffectiveScale(source, crop, editor.rotation, editor.zoom)
  const limits = getPanLimits({
    source,
    crop,
    rotation: editor.rotation,
    effectiveScale: scale,
  })
  const gesture = usePanGesture({ pan: editor.pan, limits, onPan })

  return (
    <div
      className={`editor-viewport ${gesture.isDragging ? 'is-dragging' : ''}`}
      onPointerDown={gesture.onPointerDown}
      onPointerMove={gesture.onPointerMove}
      onPointerUp={gesture.onPointerUp}
      onPointerCancel={gesture.onPointerCancel}
      aria-label="Crop editor. Drag to reposition the image."
      role="application"
    >
      <img
        className="editor-image"
        src={imageSrc}
        alt="Asymmetric sample image for cropping"
        draggable={false}
        onLoad={(event) => onImageLoad(event.currentTarget)}
        onError={onImageError}
        style={{
          width: `${source.width * scale}px`,
          height: `${source.height * scale}px`,
          transform: `translate(calc(-50% + ${editor.pan.x}px), calc(-50% + ${editor.pan.y}px)) rotate(${editor.rotation}deg)`,
        }}
      />
      <div
        className="crop-frame"
        aria-hidden="true"
        style={{
          left: `${crop.x}px`,
          top: `${crop.y}px`,
          width: `${crop.width}px`,
          height: `${crop.height}px`,
        }}
      >
        <span className="crop-frame__line crop-frame__line--vertical" />
        <span className="crop-frame__line crop-frame__line--horizontal" />
      </div>
      <span className="editor-viewport__instruction">Drag image</span>
      <span className="sr-only">
        Crop area is {Math.round(crop.width)} by {Math.round(crop.height)} pixels.
      </span>
    </div>
  )
}
