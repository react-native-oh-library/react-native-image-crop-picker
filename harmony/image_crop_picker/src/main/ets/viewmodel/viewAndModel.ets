
export class RegionItem {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class IconStatus {
  normal: Resource;
  chosen: Resource;
  constructor(normal: Resource, chosen: Resource) {
    this.normal = normal;
    this.chosen = chosen;
  }
}

export enum CropType {
  ORIGINAL_IMAGE,
  SQUARE,
  BANNER,
  RECTANGLE
}

export enum RotateType {
  CLOCKWISE,
  ANTI_CLOCK
}

export enum MainTabId {
  CROP,
  ROTATE
}