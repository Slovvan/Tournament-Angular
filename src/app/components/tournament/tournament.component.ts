import { Component, input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { stringify } from 'node:querystring';

export interface Player {
  id: number;
  name: string;
  isactive: boolean;
  score: number;
  totalWins: number;
}

@Component({
  selector: 'tournament-table',
  imports: [RouterOutlet, FormsModule, NgIf, NgFor],
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.css'
})
export class TournamentComponent implements OnInit, OnChanges {
  numPlayers = input<number>(16);
  playerCount = this.numPlayers();
  players: Player[] = [];

  roundWinners: (Player | null)[] = new Array(8).fill(null);
  quarterWinners: (Player | null)[] = new Array(4).fill(null);
  semiWinners: (Player | null)[] = new Array(2).fill(null);
  champion: Player | null = null;

  ngOnInit() {
    this.initializeTournament();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numPlayers']) {
      this.playerCount = this.numPlayers();
      this.initializeTournament();
    }
  }

  initializeTournament(): void {
    const currentNumPlayers = this.playerCount;
    
    // Preserve existing players and their total wins
    const existingPlayers = [...this.players];
    
    this.players = [];
    this.roundWinners = new Array(8).fill(null);
    this.quarterWinners = new Array(4).fill(null);
    this.semiWinners = new Array(2).fill(null);
    this.champion = null;

    for (let i = 0; i < 16; i++) {
      const existingPlayer = existingPlayers.find(p => p.id === i);
      this.players.push({
        id: i,
        name: existingPlayer?.name || `PLAYER ${String(i + 1).padStart(2, '0')}`,
        isactive: i < currentNumPlayers,
        score: 0,
        totalWins: existingPlayer?.totalWins || 0
      });
    }
  }

  isPlayerSlotDisabled(playerIndex: number): boolean {
    return playerIndex >= this.playerCount;
  }

  onChangePlayersName(value: string, playerIndex: number): void {
    const existingPlayer = this.players.find(player => player.id === playerIndex);
    if (existingPlayer) {
      existingPlayer.name = value;
      this.clearLaterStages();
    }
  }

  getPlayerById(playerIndex: number): Player | undefined {
    return this.players.find(player => player.id === playerIndex);
  }

  getPlayerLabel(playerIndex: number): string {
    return `PLAYER ${String(playerIndex + 1).padStart(2, '0')}`;
  }

  // Round of 16 - Play match with dice
  playRound(matchIndex: number): void {
    const p1 = this.getPlayerById(matchIndex * 2);
    const p2 = this.getPlayerById(matchIndex * 2 + 1);
    if (!p1 || !p2 || !p1.isactive || !p2.isactive) {
      return;
    }

    // Roll dice (1-6) for each player
    const score1 = Math.floor(Math.random() * 6) + 1;
    const score2 = Math.floor(Math.random() * 6) + 1;
    
    // Determine winner (re-roll if tie)
    let winner: Player;
    if (score1 > score2) {
      winner = p1;
    } else if (score2 > score1) {
      winner = p2;
    } else {
      // Tie - random winner
      winner = Math.random() < 0.5 ? p1 : p2;
    }

    this.roundWinners[matchIndex] = winner;
    this.clearQuartersAndLater();
  }

  // Round of 16 - Manual winner selection
  selectRoundWinner(matchIndex: number, optionIndex: number): void {
    const player = this.getPlayerById(matchIndex * 2 + optionIndex);
    if (!player || !player.isactive) {
      return;
    }

    this.roundWinners[matchIndex] = player;
    this.clearQuartersAndLater();
  }

  playQuarter(matchIndex: number): void {
    const p1 = this.roundWinners[matchIndex * 2];
    const p2 = this.roundWinners[matchIndex * 2 + 1];
    if (!p1 || !p2) {
      return;
    }

    const score1 = Math.floor(Math.random() * 6) + 1;
    const score2 = Math.floor(Math.random() * 6) + 1;
    
    let winner: Player;
    if (score1 > score2) {
      winner = p1;
    } else if (score2 > score1) {
      winner = p2;
    } else {
      winner = Math.random() < 0.5 ? p1 : p2;
    }

    this.quarterWinners[matchIndex] = winner;
    this.clearSemisAndLater();
  }

  selectQuarterWinner(matchIndex: number, optionIndex: number): void {
    const player = this.roundWinners[matchIndex * 2 + optionIndex];
    if (!player) {
      return;
    }

    this.quarterWinners[matchIndex] = player;
    this.clearSemisAndLater();
  }

  playSemi(matchIndex: number): void {
    const p1 = this.quarterWinners[matchIndex * 2];
    const p2 = this.quarterWinners[matchIndex * 2 + 1];
    if (!p1 || !p2) {
      return;
    }

    const score1 = Math.floor(Math.random() * 6) + 1;
    const score2 = Math.floor(Math.random() * 6) + 1;
    
    let winner: Player;
    if (score1 > score2) {
      winner = p1;
    } else if (score2 > score1) {
      winner = p2;
    } else {
      winner = Math.random() < 0.5 ? p1 : p2;
    }

    this.semiWinners[matchIndex] = winner;
    this.champion = null;
  }

  selectSemiWinner(matchIndex: number, optionIndex: number): void {
    const player = this.quarterWinners[matchIndex * 2 + optionIndex];
    if (!player) {
      return;
    }

    this.semiWinners[matchIndex] = player;
    this.champion = null;
  }

  playFinal(): void {
    const p1 = this.semiWinners[0];
    const p2 = this.semiWinners[1];
    if (!p1 || !p2) {
      return;
    }

    const score1 = Math.floor(Math.random() * 6) + 1;
    const score2 = Math.floor(Math.random() * 6) + 1;
    
    let winner: Player;
    if (score1 > score2) {
      winner = p1;
    } else if (score2 > score1) {
      winner = p2;
    } else {
      winner = Math.random() < 0.5 ? p1 : p2;
    }

    this.champion = winner;
    
    // Add total win to champion
    const championPlayer = this.players.find(p => p.id === winner.id);
    if (championPlayer) {
      championPlayer.totalWins++;
    }
  }

  selectChampion(optionIndex: number): void {
    const player = this.semiWinners[optionIndex];
    if (!player) {
      return;
    }

    this.champion = player;
    
    // Add total win to champion
    const championPlayer = this.players.find(p => p.id === player.id);
    if (championPlayer) {
      championPlayer.totalWins++;
    }
  }

  // Reset tournament keeping total wins
  resetTournament(): void {
    this.roundWinners = new Array(8).fill(null);
    this.quarterWinners = new Array(4).fill(null);
    this.semiWinners = new Array(2).fill(null);
    this.champion = null;
    
    // Reset scores but keep names and total wins
    this.players.forEach(player => {
      player.score = 0;
    });
  }

  // Empty tournament - reset everything including names
  emptyTournament(): void {
    this.playerCount = 0;
    this.initializeTournament();
  }

  // Randomize player positions
  randomizePlaces(): void {
    const currentNumPlayers = this.playerCount;
    const activePlayers = this.players
      .filter(p => p.isactive)
      .map(p => ({ ...p }));

    // Fisher-Yates shuffle on cloned objects
    for (let i = activePlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activePlayers[i], activePlayers[j]] = [activePlayers[j], activePlayers[i]];
    }

    // Reassign to players array using cloned shuffled players
    let activeIndex = 0;
    this.players.forEach((player, index) => {
      if (index < currentNumPlayers) {
        const shuffledPlayer = activePlayers[activeIndex];
        player.id = index;
        player.name = shuffledPlayer.name;
        player.isactive = true;
        player.score = shuffledPlayer.score;
        player.totalWins = shuffledPlayer.totalWins;
        activeIndex++;
      } else {
        player.isactive = false;
      }
    });

    this.clearLaterStages();
  }

  private clearLaterStages(): void {
    this.roundWinners.fill(null);
    this.quarterWinners.fill(null);
    this.semiWinners.fill(null);
    this.champion = null;
  }

  private clearQuartersAndLater(): void {
    this.quarterWinners.fill(null);
    this.semiWinners.fill(null);
    this.champion = null;
  }

  private clearSemisAndLater(): void {
    this.semiWinners.fill(null);
    this.champion = null;
  }
}