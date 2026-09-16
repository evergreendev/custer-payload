export const BRICK_PANELS = [
  { label: 'North West', value: 'north-west' },
  { label: 'North East', value: 'north-east' },
]

export const BRICK_ROWS = Array.from({ length: 14 }, (_, i) =>
  String.fromCharCode('A'.charCodeAt(0) + i),
)

export const BRICK_COLUMN_COUNT = 50
