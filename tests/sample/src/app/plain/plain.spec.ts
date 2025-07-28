import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plain } from './plain';

describe('Plain', () => {
  let component: Plain;
  let fixture: ComponentFixture<Plain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Plain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
