import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgifWithThen } from './ngif-with-then';

describe('NgifWithThen', () => {
  let component: NgifWithThen;
  let fixture: ComponentFixture<NgifWithThen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgifWithThen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgifWithThen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
