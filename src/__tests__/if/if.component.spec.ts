import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfComponent } from './if.component';

describe('IfComponent', () => {
  let component: IfComponent;
  let fixture: ComponentFixture<IfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
