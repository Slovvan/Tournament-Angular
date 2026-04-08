import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TournamentComponent } from "./components/tournament/tournament.component";
import { NumberPlayersComponent } from "./components/number-players/number-players.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TournamentComponent, NumberPlayersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tournament-web-practice';
  numPlayers = signal<number>(0);

  onPlayerNumChange(num: number) {
    this.numPlayers.set(num);
    console.log(`Number of players selected: ${this.numPlayers()}`);
  }
}
