import * as PIXI from "pixi.js";
import {ShipType} from "../enums";
import {Pier} from "../models/pier";

export interface IShip {
    sprite: PIXI.Graphics;
    type: ShipType;
    changeColor(): void;
}

export interface IPort {
    game: PIXI.Application;
    piers: Array<Pier>;
    generateShip(): void;
    startSimulation(): void;
}

export interface IPier {
    position: PIXI.Point;
    occupied: boolean;
    loading: boolean;
    occupy(): void;
    release(): void;
    changeColor(): void;
}
