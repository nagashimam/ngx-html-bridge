import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TernaryOperator } from './ternary-operator';

describe('TernaryOperator', () => {
  let component: TernaryOperator;
  let fixture: ComponentFixture<TernaryOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TernaryOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TernaryOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
