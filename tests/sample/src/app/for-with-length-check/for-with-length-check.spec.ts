import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForWithLengthCheck } from './for-with-length-check';

describe('ForWithLengthCheck', () => {
  let component: ForWithLengthCheck;
  let fixture: ComponentFixture<ForWithLengthCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForWithLengthCheck]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForWithLengthCheck);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
