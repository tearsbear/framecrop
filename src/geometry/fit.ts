import { getRotatedBounds } from './rotation'
import type { Rect, Rotation, Size, SourceImage } from './types'

export function getCropFrame(viewport: Size): Rect {
  const availableWidth = viewport.width * 0.8
  const availableHeight = viewport.height * 0.8
  const width = Math.min(availableWidth, availableHeight * (4 / 3))
  const height = width * (3 / 4)

  return {
    x: (viewport.width - width) / 2,
    y: (viewport.height - height) / 2,
    width,
    height,
  }
}

export function getFitScale(source: SourceImage, crop: Rect, rotation: Rotation) {
  const bounds = getRotatedBounds(source, rotation)
  return Math.max(crop.width / bounds.width, crop.height / bounds.height)
}

export function getEffectiveScale(
  source: SourceImage,
  crop: Rect,
  rotation: Rotation,
  zoom: number,
) {
  return getFitScale(source, crop, rotation) * zoom
}

export function clampZoom(value: number) {
  return Math.min(2.5, Math.max(1, Math.round(value * 10) / 10))
}
