import * as PIXI from "pixi.js";
import {ShipType} from "../enums";
import {Ship} from "../models/ship";
import {Pier} from "../models/pier";

export interface IShip {
    sprite: PIXI.Graphics;
    type: ShipType;
    changeColor(): void;
}

export interface IPort {
    game: PIXI.Application;
    ships: Ship[];
    piers: Pier[];
    queues: { [key in ShipType]: Ship[] };

    stylizeGame(): void;
    generatePiers(): void;
    generateDock(): void;
    createDockPart(x: number, y: number, height: number): void;
    generateShipWithInterval(): void;
    generateShip(): void;
    createShip(): Ship;
    setShipInitialPosition(ship: Ship): void;
    animateShipMovement(ship: Ship): void;
    shipArrived(ship: Ship): void;
    moveToPier(targetPier: Pier, ship: Ship): void;
    shipDeparted(ship: Ship, targetPier: Pier): void;
    startSimulation(): void;
}

export interface IPier {
    occupied: boolean;
    loading: boolean;

    setupPierSprite(): void;
    occupy(): void;
    release(): void;
    changeColor(): void;

    addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
    removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
    getChildAt(index: number): PIXI.DisplayObject;
}
