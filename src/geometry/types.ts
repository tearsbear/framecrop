export type Rotation = 0 | 90 | 180 | 270

export type Size = {
  width: number
  height: number
}

export type Point = {
  x: number
  y: number
}

export type Rect = Point & Size

export type SourceImage = Size

export type PanLimits = {
  x: number
  y: number
}

export type EditorState = {
  rotation: Rotation
  zoom: number
  pan: Point
}
