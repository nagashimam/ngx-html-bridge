import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoControlFlowComponent } from './no-control-flow.component';

describe('NoControlFlowComponent', () => {
  let component: NoControlFlowComponent;
  let fixture: ComponentFixture<NoControlFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoControlFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoControlFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
