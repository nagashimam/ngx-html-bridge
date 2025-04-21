import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TernaryOperatorComponent } from './ternary-operator.component';

describe('TernaryOperatorComponent', () => {
  let component: TernaryOperatorComponent;
  let fixture: ComponentFixture<TernaryOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TernaryOperatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TernaryOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
