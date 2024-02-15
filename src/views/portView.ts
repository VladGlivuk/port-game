import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import {Ship} from "../models/ship";
import {GameConst, PierConst, ShipConst, ShipType} from "../enums";
import {IPort} from "../types";
import {Pier} from "../models/pier";

export class Port implements IPort {
    game: PIXI.Application;
    ships: Ship[] = [];
    piers: Pier[] = [];
    queues: { [key in ShipType]: Ship[] } = {
        [ShipType.Red]: [],
        [ShipType.Green]: []
    };

    constructor() {
        this.game = this.setupPixi();
        this.stylizeGame();
        this.generatePiers();
        this.generateDock();
        this.generateShipWithInterval();
    }

    setupPixi(): PIXI.Application {
        const app = new PIXI.Application({
            width: GameConst.GAME_WIDTH,
            height: GameConst.GAME_HEIGHT,
            backgroundColor: GameConst.BACKGROUND_COLOR,
        });

        document.body.appendChild(app.view);
        return app;
    }

    stylizeGame(): void {
        document.body.style.cssText = `
            display: flex;
            justify-content: center;
            background-color: #FFFFF0;
        `;
    }

    generatePiers(): void {
        for (let i = 0; i < PierConst.NUMBER_OF_PIERS; i++) {
            const pier = new Pier();
            pier.position.set(0, i * (PierConst.PIER_HEIGHT + GameConst.SPACING));
            this.game.stage.addChild(pier);
            this.piers.push(pier);
        }
    }

    generateDock(): void {
        this.createDockPart(400, 0, GameConst.GAME_HEIGHT / 2 - GameConst.DOCK_HEIGHT_OFFSET);
        this.createDockPart(400, GameConst.GAME_HEIGHT / 2 + GameConst.DOCK_HEIGHT_OFFSET,
            GameConst.GAME_HEIGHT / 2 - GameConst.DOCK_HEIGHT_OFFSET);
    }

    createDockPart(x: number, y: number, height: number): void {
        const dockPart = new PIXI.Graphics();
        dockPart.position.set(x, y);
        dockPart.beginFill(GameConst.DOCK_COLOR);
        dockPart.drawRect(0, 0, GameConst.DOCK_WIDTH, height);
        dockPart.endFill();
        this.game.stage.addChild(dockPart);
    }

    generateShipWithInterval(): void {
        setInterval(() => this.generateShip(), GameConst.TIME_INTERVAL);
    }

    generateShip(): void {
        const ship = this.createShip();
        this.ships.push(ship);
        this.game.stage.addChild(ship.sprite);
        this.setShipInitialPosition(ship);
        this.animateShipMovement(ship);
    }

    createShip(): Ship {
        const shipType: ShipType = Math.random() < 0.5 ? ShipType.Red : ShipType.Green;
        return new Ship(shipType);
    }

    setShipInitialPosition(ship: Ship): void {
        ship.sprite.position.set(GameConst.GAME_WIDTH - ShipConst.SHIP_WIDTH - ShipConst.SHIP_OFFSET_X, GameConst.GAME_HEIGHT / 2);
    }

    animateShipMovement(ship: Ship): void {
        new TWEEN.Tween(ship.sprite.position)
            .to({ x: 350 }, 5000)
            .onComplete(() => this.shipArrived(ship))
            .start();
    }

    shipArrived(ship: Ship):void {
        if (ship.type === ShipType.Red) {
            const targetPier = this.piers.find((p) => !p.occupied && !p.loading);
            this.moveShipsToQueue(ship, ShipType.Red, targetPier!);

        } else {
            const targetPier = this.piers.find((p)=> p.occupied && !p.loading);
            this.moveShipsToQueue(ship, ShipType.Green, targetPier!);
        }
    }

    moveShipsToQueue(ship: Ship, shipType: ShipType, targetPier: Pier) {
        if (targetPier && this.queues[shipType].length === 0) {
            targetPier.loading = true;
            this.moveToPier(targetPier, ship);
        } else {
            let nums = {
                x: 450,
                y: 230
            };
            if (this.queues[shipType].length) {
                nums.x = this.queues[shipType][this.queues[shipType].length - 1]?.sprite.position.x + 100;
            }
            this.queues[shipType].push(ship);
            new TWEEN.Tween(ship.sprite.position)
                .to(nums, 1000)
                .start();
        }
    }


    handlerQueue(queue: Array<Ship>, pier: Pier): void {
        if (queue.length) {
            pier.loading = true;
            const ship = queue[0];
            queue.shift();
            new TWEEN.Tween(ship.sprite.position)
                .to({ x: 350, y: 300 }, 1000)
                .start()
                .onComplete(() => {
                    this.moveToPier(pier, ship);
                });
        }
    }

    handlerQueueRed(pier: Pier): void {
        this.handlerQueue(this.queues[ShipType.Red], pier);
    }

    handlerQueueGreen(pier: Pier): void {
        this.handlerQueue(this.queues[ShipType.Green], pier);
    }



    moveToPier(targetPier:Pier, ship:Ship): void{
        new TWEEN.Tween(ship.sprite.position)
            .to({ x: targetPier.position.x + 70, y: targetPier.position.y + 70 }, 5000)
            .onComplete(() =>{
                if (ship.type === ShipType.Red) {
                    targetPier.occupy();
                    targetPier.changeColor();
                    ship.changeColor()
                }
                else {
                    targetPier.release();
                    targetPier.changeColor();
                    ship.changeColor()
                }
                this.shipDeparted(ship, targetPier)
            })
            .start();
    }

    shipDeparted(ship: Ship, targetPier: Pier):void {
       new TWEEN.Tween(ship.sprite.position)
            .delay(5000)
            .onComplete(()=>{
                targetPier.loading = false
                new TWEEN.Tween(ship.sprite.position)
                    .to({ x: 350, y: 400 }, 3000)
                    .onComplete(() => {
                        new TWEEN.Tween(ship.sprite.position)
                            .to({x:1200},5000)
                            .onComplete(()=>{
                                const index = this.ships.indexOf(ship);
                                if (index !== -1) {
                                    this.ships.splice(index, 1);
                                }
                                this.game.stage.removeChild(ship.sprite);
                            })
                            .start()
                    })
                    .start();
            })
            .start()
    }

    startSimulation(): void {
        this.game.ticker.add(() => TWEEN.update());
    }
}

