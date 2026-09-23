import type { Rotation } from '../geometry/types'

type EditorSize = 'compact' | 'default' | 'wide'

type EditorControlsProps = {
  zoom: number
  rotation: Rotation
  pan: { x: number; y: number }
  editorSize: EditorSize
  onZoom: (change: number) => void
  onRotate: (change: number) => void
  onSize: (size: EditorSize) => void
}

const sizes: Array<{ value: EditorSize; label: string }> = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'wide', label: 'Wide' },
]

export function EditorControls({
  zoom,
  rotation,
  pan,
  editorSize,
  onZoom,
  onRotate,
  onSize,
}: EditorControlsProps) {
  return (
    <div className="editor-controls">
      <section className="control-group" aria-labelledby="zoom-heading">
        <div className="section-heading">
          <h2 id="zoom-heading">Zoom</h2>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
        </div>
        <div className="stepper" aria-label="Zoom controls">
          <button type="button" onClick={() => onZoom(-0.1)} aria-label="Zoom out">
            −
          </button>
          <input
            aria-label="Zoom level"
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={zoom}
            onChange={(event) => onZoom(Number(event.target.value) - zoom)}
          />
          <button type="button" onClick={() => onZoom(0.1)} aria-label="Zoom in">
            +
          </button>
        </div>
      </section>

      <section className="control-group" aria-labelledby="rotation-heading">
        <div className="section-heading">
          <h2 id="rotation-heading">Rotation</h2>
          <output aria-live="polite">{rotation}°</output>
        </div>
        <div className="rotation-actions">
          <button type="button" onClick={() => onRotate(-90)}>Rotate Left</button>
          <button type="button" onClick={() => onRotate(90)}>Rotate Right</button>
        </div>
      </section>

      <section className="control-group" aria-labelledby="size-heading">
        <div className="section-heading">
          <h2 id="size-heading">Editor width</h2>
        </div>
        <div className="size-options">
          {sizes.map((size) => (
            <button
              type="button"
              key={size.value}
              className={editorSize === size.value ? 'is-selected' : ''}
              onClick={() => onSize(size.value)}
              aria-pressed={editorSize === size.value}
            >
              {size.label}
            </button>
          ))}
        </div>
      </section>

      <section className="position-readout" aria-label="Current image position">
        <h2>Position</h2>
        <dl>
          <div><dt>Pan X</dt><dd>{Math.round(pan.x)} px</dd></div>
          <div><dt>Pan Y</dt><dd>{Math.round(pan.y)} px</dd></div>
          <div><dt>Zoom</dt><dd>{Math.round(zoom * 100)}%</dd></div>
          <div><dt>Rotation</dt><dd>{rotation}°</dd></div>
        </dl>
      </section>
    </div>
  )
}

export type { EditorSize }
