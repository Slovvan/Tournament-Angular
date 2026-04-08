import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberPlayersComponent } from './number-players.component';

describe('NumberPlayersComponent', () => {
  let component: NumberPlayersComponent;
  let fixture: ComponentFixture<NumberPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberPlayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
