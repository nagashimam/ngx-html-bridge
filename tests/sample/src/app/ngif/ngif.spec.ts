import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ngif } from './ngif';

describe('Ngif', () => {
  let component: Ngif;
  let fixture: ComponentFixture<Ngif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ngif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ngif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
