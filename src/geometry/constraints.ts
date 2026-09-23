import { getRotatedBounds } from './rotation'
import type { PanLimits, Point, Rect, Rotation, SourceImage } from './types'

type ConstraintInput = {
  source: SourceImage
  crop: Rect
  rotation: Rotation
  effectiveScale: number
}

export function getPanLimits({
  source,
  crop,
  rotation,
  effectiveScale,
}: ConstraintInput): PanLimits {
  const bounds = getRotatedBounds(source, rotation)
  return {
    x: Math.max(0, (bounds.width * effectiveScale - crop.width) / 2),
    y: Math.max(0, (bounds.height * effectiveScale - crop.height) / 2),
  }
}

export function getResizePanLimits({
  source,
  crop,
  effectiveScale,
}: Omit<ConstraintInput, 'rotation'>): PanLimits {
  return {
    x: Math.max(0, (source.width * effectiveScale - crop.width) / 2),
    y: Math.max(0, (source.height * effectiveScale - crop.height) / 2),
  }
}

export function clampPan(pan: Point, limits: PanLimits): Point {
  return {
    x: Math.max(-limits.x, Math.min(limits.x, pan.x)),
    y: Math.max(-limits.y, Math.min(limits.y, pan.y)),
  }
}
