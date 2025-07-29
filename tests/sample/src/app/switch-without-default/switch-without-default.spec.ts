import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchWithoutDefault } from './switch-without-default';

describe('SwitchWithoutDefault', () => {
  let component: SwitchWithoutDefault;
  let fixture: ComponentFixture<SwitchWithoutDefault>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchWithoutDefault]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchWithoutDefault);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
