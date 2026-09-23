import { useEffect, useMemo, useRef, useState } from 'react'
import { CropPreview } from '../components/CropPreview'
import { EditorControls, type EditorSize } from '../components/EditorControls'
import { EditorViewport } from '../components/EditorViewport'
import { SAMPLE_IMAGE, SAMPLE_IMAGE_SRC } from '../data/sampleImage'
import { clampPan, getPanLimits } from '../geometry/constraints'
import { clampZoom, getCropFrame, getEffectiveScale } from '../geometry/fit'
import { normalizeRotation } from '../geometry/rotation'
import type { EditorState, Size } from '../geometry/types'
import { useEditorResize } from '../hooks/useEditorResize'

const editorWidths: Record<EditorSize, number> = {
  compact: 420,
  default: 640,
  wide: 780,
}

const defaultEditor: EditorState = {
  rotation: 0,
  zoom: 1,
  pan: { x: 0, y: 0 },
}

function constrainEditor(editor: EditorState, viewport: Size) {
  const crop = getCropFrame(viewport)
  const effectiveScale = getEffectiveScale(SAMPLE_IMAGE, crop, editor.rotation, editor.zoom)
  return {
    ...editor,
    pan: clampPan(editor.pan, getPanLimits({
      source: SAMPLE_IMAGE,
      crop,
      rotation: editor.rotation,
      effectiveScale,
    })),
  }
}

export function App() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const previousViewport = useRef<Size | null>(null)
  const viewport = useEditorResize(viewportRef, { width: 640, height: 480 })
  const [editor, setEditor] = useState<EditorState>(defaultEditor)
  const [editorSize, setEditorSize] = useState<EditorSize>('default')
  const [imageStatus, setImageStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [previewRevision, setPreviewRevision] = useState(0)

  const crop = useMemo(() => getCropFrame(viewport), [viewport])

  useEffect(() => {
    const previous = previousViewport.current
    previousViewport.current = viewport
    if (!previous || (previous.width === viewport.width && previous.height === viewport.height)) return

    setEditor((current) => {
      const effectiveScale = getEffectiveScale(SAMPLE_IMAGE, crop, current.rotation, current.zoom)
      const limits = getPanLimits({
        source: SAMPLE_IMAGE,
        crop,
        rotation: current.rotation,
        effectiveScale,
      })

      return { ...current, pan: clampPan(current.pan, limits) }
    })
  }, [crop, viewport])

  const changeZoom = (change: number) => {
    setEditor((current) => constrainEditor({ ...current, zoom: clampZoom(current.zoom + change) }, viewport))
  }

  const rotate = (change: number) => {
    setEditor((current) => constrainEditor({
      ...current,
      rotation: normalizeRotation(current.rotation + change),
    }, viewport))
  }

  const reset = () => {
    setEditor(defaultEditor)
    setEditorSize('default')
    setPreviewRevision(0)
  }

  const preview = () => {
    if (imageStatus === 'ready') setPreviewRevision((revision) => revision + 1)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="product-name">FrameCrop</p>
          <h1>Simple image crop editor</h1>
        </div>
        <div className="header-actions">
          <button type="button" className="button button--quiet" onClick={reset}>Reset</button>
          <button type="button" className="button button--primary" onClick={preview} disabled={imageStatus !== 'ready'}>
            Preview Crop
          </button>
        </div>
      </header>

      <div className="workspace">
        <section className="editor-panel" aria-labelledby="editor-heading">
          <div className="editor-panel__heading">
            <div>
              <p className="eyebrow">Source image</p>
              <h2 id="editor-heading">Adjust the visible frame</h2>
            </div>
            <span className="frame-ratio">4:3 frame</span>
          </div>
          <div className="viewport-wrap" style={{ width: `${editorWidths[editorSize]}px` }} ref={viewportRef}>
            <EditorViewport
              imageSrc={SAMPLE_IMAGE_SRC}
              source={SAMPLE_IMAGE}
              viewport={viewport}
              crop={crop}
              editor={editor}
              onPan={(pan) => setEditor((current) => ({ ...current, pan }))}
              onImageLoad={(image) => {
                imageRef.current = image
                setImageStatus('ready')
              }}
              onImageError={() => setImageStatus('error')}
            />
          </div>
          {imageStatus === 'loading' ? <p className="image-status">Loading bundled image.</p> : null}
          {imageStatus === 'error' ? <p className="image-status image-status--error">The bundled image could not be loaded. Refresh to try again.</p> : null}
        </section>

        <aside className="controls-panel" aria-label="Image editor controls">
          <EditorControls
            zoom={editor.zoom}
            rotation={editor.rotation}
            pan={editor.pan}
            editorSize={editorSize}
            onZoom={changeZoom}
            onRotate={rotate}
            onSize={setEditorSize}
          />
          <CropPreview
            image={imageRef.current}
            source={SAMPLE_IMAGE}
            viewport={viewport}
            crop={crop}
            editor={editor}
            revision={previewRevision}
          />
        </aside>
      </div>
    </main>
  )
}
