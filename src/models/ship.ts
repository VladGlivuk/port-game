import * as PIXI from 'pixi.js';
import {ShipConst, ShipType} from "../enums";
import {IShip} from "../types";

export class Ship implements IShip{
    sprite: PIXI.Graphics;
    type: ShipType;

    constructor(type: ShipType) {
        this.type = type;
        this.sprite = new PIXI.Graphics();
        this.drawShip()
    }

    drawShip(): void {
        if (this.type === ShipType.Red) {
            this.sprite.beginFill(ShipConst.SHIP_COLOR_FULL);
        } else {
            this.sprite.beginFill(ShipConst.SHIP_COLOR_EMPTY, 0);
            this.sprite.lineStyle(ShipConst.SHIP_LINE, ShipConst.SHIP_COLOR_EMPTY);
        }
        this.sprite.drawRect(0, 0, ShipConst.SHIP_WIDTH, ShipConst.SHIP_HEIGHT);
        this.sprite.endFill();
    }

    changeColor(): void {
        this.sprite.clear();
        if (this.type === ShipType.Red) {
            this.sprite.beginFill(ShipConst.SHIP_COLOR_EMPTY, 0);
            this.sprite.lineStyle(5, ShipConst.SHIP_COLOR_EMPTY);
        } else {
            this.sprite.beginFill(ShipConst.SHIP_COLOR_EMPTY);
        }
        this.sprite.drawRect(0, 0, ShipConst.SHIP_WIDTH, ShipConst.SHIP_HEIGHT);
        this.sprite.endFill();
    }
}
