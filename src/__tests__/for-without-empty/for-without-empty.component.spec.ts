import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForWithoutEmptyComponent } from './for-without-empty.component';

describe('ForWithoutEmptyComponent', () => {
  let component: ForWithoutEmptyComponent;
  let fixture: ComponentFixture<ForWithoutEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForWithoutEmptyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForWithoutEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
