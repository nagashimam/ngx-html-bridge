import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetComponent } from './let.component';

describe('LetComponent', () => {
  let component: LetComponent;
  let fixture: ComponentFixture<LetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
