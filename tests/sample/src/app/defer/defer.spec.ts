import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Defer } from './defer';

describe('Defer', () => {
  let component: Defer;
  let fixture: ComponentFixture<Defer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Defer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Defer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
