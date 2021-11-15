import { Injectable } from '@angular/core';
import { Game } from './game.model';

@Injectable({
  providedIn: 'root'
})
export class BowlingService {
  currentGame: Game = {
    frames: []
  };

  currentFrameIndex: number = 0;

  constructor() { }

  startNewGame() {
    this.currentGame = {
      frames: []
    };
    this.currentFrameIndex = 0;
    for (let i = 0; i < 10; i++) {
      this.startNewFrame();
    }
    return this.currentGame;
  }

  getCurrentFrame() {
    return this.currentGame.frames[this.currentFrameIndex];
  }

  getCurrentFrameRollCount() {
    return this.currentGame.frames[this.currentFrameIndex].rolls.length;
  }

  getPinsRemaining() {
    let frame = this.currentGame.frames[this.currentFrameIndex];
    if (this.currentFrameIndex > 9) {
      return 0;
    }
    if (this.getCurrentFrameRollCount() === 0) {
      return 10;
    }
    if (this.currentFrameIndex === 9) {
      if (this.getCurrentFrameRollCount() === 1) {
        if (frame.isStrike) {
          return 10;
        } else {
          return 10 - frame.rolls[0];
        }
      } else if (this.getCurrentFrameRollCount() === 2) {
        if (frame.rolls[1] === 10) {
          return 10;
        } else {
          return 10 - frame.rolls[1];
        }
      } else {
        return 0;
      }
    } else {
      return 10 - this.getPinsDown();
    }
  }

  addRoll(pins: number) {
    if (this.currentFrameIndex < 10) {
      let frame = this.currentGame.frames[this.currentFrameIndex];
      let maxRolls = (this.currentFrameIndex === 9 && frame.isStrike) ? 3 : 2;
      if (this.currentFrameIndex < 9 && pins === 10) {
        maxRolls = 1;
      }
      frame.rolls.push(pins);
      this.updateScores();
      // console.log('frame roll count', this.getCurrentFrameRollCount());
      // console.log('max rolls', maxRolls);
      if (this.getCurrentFrameRollCount() >= maxRolls) {
        this.currentFrameIndex++;
      }
    }
    // console.log('currentFrameIndex', this.currentFrameIndex);
    return this.currentGame;
  }

  private getPinsDown() {
    let frame = this.currentGame.frames[this.currentFrameIndex];
    if (frame.rolls.length > 1) {
      return frame.rolls.reduce((a, b) => a + b);
    } else {
      return frame.rolls[0];
    }
  }

  private startNewFrame() {
    this.currentGame.frames.push({
      rolls: [],
      score: 0,
      scoreTotal: 0,
      isStrike: false,
      isSpare: false
    });
  }

  private updateScores() {
    for (let i = 0; i < 10; i++) {
      this.currentGame.frames[i].score = this.calculateFrameScore(i);
      this.currentGame.frames[i].scoreTotal = this.calculateFrameTotalScore(i);
    }
    // console.info('frames', this.currentGame.frames);
  }

  private calculateFrameTotalScore(frameIndex: number) {
    let frame = this.currentGame.frames[frameIndex];
    if (frameIndex > 0) {
      return this.currentGame.frames[frameIndex - 1].scoreTotal + frame.score;
    } else {
      return frame.score;
    }
  }

  private calculateFrameScore(frameIndex: number) {
    let frame = this.currentGame.frames[frameIndex];

    // set isStrike and isSpare
    if (frame.rolls[0] === 10) {
      frame.isStrike = true;
    } else if (frame.rolls[0] + frame.rolls[1] === 10) {
      frame.isSpare = true;
    }

    if (frameIndex === 9) {
      return this.calculateFrameTotal(frameIndex);
    } else if (frame.isStrike) {
      return 10 + this.calculateStrikeBonus(frameIndex);
    } else if (frame.isSpare) {
      return 10 + this.calculateSpareBonus(frameIndex);
    } else {
      return this.calculateFrameTotal(frameIndex);
    }
  }

  private calculateFrameTotal(frameIndex: number) {
    let frame = this.currentGame.frames[frameIndex];
    if (frame.rolls.length > 1) {
      return this.currentGame.frames[frameIndex].rolls.reduce((a, b) => a + b);
    } else {
      return this.currentGame.frames[frameIndex].rolls[0];
    }
  }

  private calculateSpareBonus(frameIndex: number) {
    return this.currentGame.frames[frameIndex + 1].rolls[0];
  }

  // This method is not called for the last frame.
  private calculateStrikeBonus(frameIndex: number) {
    let bonus = 0;
    bonus += this.currentGame.frames[frameIndex + 1].rolls[0];
    // special logic for 9th frame;
    if (frameIndex === 8) {
      bonus += this.currentGame.frames[frameIndex + 1].rolls[1];
      return bonus;
    }
    // normal logic.
    if (this.currentGame.frames[frameIndex + 1].isStrike) {
      bonus += this.currentGame.frames[frameIndex + 2].rolls[0];
    } else {
      bonus += this.currentGame.frames[frameIndex + 1].rolls[1];
    }

    return bonus;
  }

}
