import { Component, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'number-players',
  imports: [],
  templateUrl: './number-players.component.html',
  styleUrl: './number-players.component.css'
})
export class NumberPlayersComponent {
  numPlayers = signal<number>(0);

@Output() playerNum = new EventEmitter<number>();

  onChangeNumber(value: string) {
    let num = Number(value);
    this.numPlayers.set(num);
    this.playerNum.emit(num);
    
  }
  
}
