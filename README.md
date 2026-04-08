# TournamentWebPractice

A knockout tournament application developed using Angular.

## Description

This project simulates a 16-player tournament and displays each stage of the bracket:

- Round of 16
- Quarter-finals
- Semi-finals
- Final

The application allows you to proceed with random results or select the winners manually.

## How to run

From the project folder, run:

```bash
npm install
ng serve
```

Then open `http://localhost:4200/` in your browser.

## Tournament logic

The main component is in `src/app/components/tournament/tournament.component.ts`.

### Tournament state

- `numPlayers`: input that defines how many active players there are.
- `playerCount`: internal value used in the component to control how many slots are considered active.
- `players`: list of up to 16 players with data such as `id`, `name`, `isactive`, `score` and `totalWins`.
- `roundWinners`: winners of the Round of 16.
- `quarterWinners`: winners of the quarter-finals.
- `semiWinners`: winners of the semi-finals.
- `champion`: the player who wins the tournament.

### Stage flow

1. `initializeTournament()`
   - constructs the array of 16 players
   - activates only the first `playerCount`
   - resets all results

2. `playRound(matchIndex)`
   - pits two players from the Round of 16 against each other
   - generates two random values between 1 and 6
   - saves the winner to `roundWinners`
   - clears the quarter-finals, semi-finals and final

3. `selectRoundWinner(matchIndex, optionIndex)`
   - manually selects a player as the round winner
   - clears subsequent stages

4. `playQuarter(matchIndex)` / `selectQuarterWinner(matchIndex, optionIndex)`
   - advances to the quarter-final winners
   - uses `roundWinners` as input
   - updates `quarterWinners`
   - clears semi-finals and final

5. `playSemi(matchIndex)` / `selectSemiWinner(matchIndex, optionIndex)`
   - advance to the semi-final winners
   - use `quarterWinners` as input
   - update `semiWinners`
   - clear the champion

6. `playFinal()` / `selectChampion(optionIndex)`
   - determine the champion using `semiWinners`
   - update `champion`
   - increment the winner’s `totalWins`

### Additional functions

- `resetTournament()`
  - clears all stages of the tournament
  - retains players’ names and `totalWins`

- `emptyTournament()`
  - sets `playerCount` to 0
  - completely resets the tournament

- `randomizePlaces()`
  - shuffles active players using Fisher-Yates
  - updates the table order without duplicating players
  - resets subsequent stages

## File structure

- `src/app/components/tournament/tournament.component.ts` — tournament logic
- `src/app/components/tournament/tournament.component.html` — bracket HTML template
- `src/app/components/tournament/tournament.component.css` — tournament styles

## Notes

- The component uses Angular standalone features such as `NgIf` and `NgFor` in `imports`.
- `numPlayers` is used as an external input, whilst `playerCount` controls the internal state.
- Each stage must be reset if the result of a previous stage is changed to keep the bracket consistent.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
