export enum GameConst {
  GAME_WIDTH = 1200,
  GAME_HEIGHT = 800,
  TIME_INTERVAL = 8000,
  BACKGROUND_COLOR = 0x0000ff,
  SPACING = 30,
  DOCK_COLOR = 0xffff00,
  DOCK_WIDTH = 20,
  DOCK_HEIGHT_OFFSET = 130,
}

export enum ShipConst {
  SHIP_WIDTH = 80,
  SHIP_OFFSET_X = 10,
  SHIP_HEIGHT = 30,
  SHIP_LINE = 5,
  SHIP_COLOR_FULL = 0xff0000,
  SHIP_COLOR_EMPTY = 0x00ff00,
}

export enum ShipType {
  Green = 'green',
  Red = 'red',
}

export enum PierConst {
  PIER_WIDTH = 50,
  PIER_HEIGHT = (GameConst.GAME_HEIGHT - GameConst.SPACING * 3) / 4,
  NUMBER_OF_PIERS = 4,
  PIER_LINE = 7,
  PIER_COLOR = 0xffff00,
}
