import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { BowlingService } from '../bowling.service';
import { Game } from '../game.model';

@Component({
  selector: 'app-bowling',
  templateUrl: './bowling.component.html',
  styleUrls: ['./bowling.component.scss']
})
export class BowlingComponent implements OnInit {
  currentGame?: Game = undefined;
  pinsRemainingButtons: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private bowlingService: BowlingService) { }

  ngOnInit(): void {
    this.currentGame = this.bowlingService.startNewGame();
  }

  reset() {
    this.currentGame = this.bowlingService.startNewGame();
    this.pinsRemainingButtons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  roll(pins: number): void {
    this.currentGame = this.bowlingService.addRoll(pins);
    this.updatePinsRemainingButtons();
  }

  updatePinsRemainingButtons() {
    const pinsRemaining = this.bowlingService.getPinsRemaining();
    this.pinsRemainingButtons = [...Array(pinsRemaining+1).keys()].map(i => i);
  }

}
