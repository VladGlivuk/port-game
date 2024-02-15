import * as PIXI from 'pixi.js';
import { PierConst } from '../enums';
import { IPier } from '../types';
import { port } from '../index';

export class Pier extends PIXI.Container implements IPier {
  public occupied: boolean = false;
  private _loading: boolean = false;
  pierSprite!: PIXI.Graphics;

  constructor() {
    super();
    this.setupPierSprite();
  }

  setupPierSprite(): void {
    this.pierSprite = new PIXI.Graphics();
    this.pierSprite.lineStyle(PierConst.PIER_LINE, PierConst.PIER_COLOR);
    this.pierSprite.beginFill(PierConst.PIER_COLOR, 0);
    this.pierSprite.drawRect(5, 0, PierConst.PIER_WIDTH, PierConst.PIER_HEIGHT);
    this.pierSprite.endFill();
    this.addChild(this.pierSprite);
  }

  get loading() {
    return this._loading;
  }

  set loading(value) {
    this._loading = value;

    if (!value) this.occupied ? port.handlerQueueGreen(this) : port.handlerQueueRed(this);
  }

  occupy(): void {
    this.occupied = true;
  }

  release(): void {
    this.occupied = false;
  }

  changeColor(): void {
    const pierSprite = this.getChildAt(0) as PIXI.Graphics;
    pierSprite.clear();

    if (this.occupied) {
      pierSprite.beginFill(PierConst.PIER_COLOR);
    } else {
      pierSprite.beginFill(PierConst.PIER_COLOR, 0);
      pierSprite.lineStyle(PierConst.PIER_LINE, PierConst.PIER_COLOR);
    }

    pierSprite.drawRect(5, 0, PierConst.PIER_WIDTH, PierConst.PIER_HEIGHT);
    pierSprite.endFill();
  }
}
