import { getEffectiveScale } from './fit'
import type { Point, Rect, Rotation, Size, SourceImage } from './types'

type PreviewInput = {
  context: CanvasRenderingContext2D
  image: CanvasImageSource
  source: SourceImage
  rotation: Rotation
  zoom: number
  pan: Point
  viewport: Size
  crop: Rect
  output: Size
}

function getPreviewSourceOrigin(source: SourceImage): Point {
  return { x: source.width / 2, y: source.height / 2 }
}

export function renderCropPreview({
  context,
  image,
  source,
  rotation,
  zoom,
  pan,
  viewport,
  crop,
  output,
}: PreviewInput) {
  const outputScale = output.width / crop.width
  const effectiveScale = getEffectiveScale(source, crop, rotation, zoom)
  const origin = getPreviewSourceOrigin(source)

  context.save()
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, output.width, output.height)
  context.fillStyle = '#111820'
  context.fillRect(0, 0, output.width, output.height)
  context.restore()

  context.save()
  context.scale(outputScale, outputScale)
  context.translate(-crop.x, -crop.y)
  context.translate(viewport.width / 2 + pan.x, viewport.height / 2 + pan.y)
  context.rotate((rotation * Math.PI) / 180)
  context.scale(effectiveScale, effectiveScale)
  context.translate(-origin.x, -origin.y)
  context.drawImage(image, 0, 0, source.width, source.height)
  context.restore()
}
