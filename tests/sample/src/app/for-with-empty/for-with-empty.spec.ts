import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForWithEmpty } from './for-with-empty';

describe('ForWithEmpty', () => {
  let component: ForWithEmpty;
  let fixture: ComponentFixture<ForWithEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForWithEmpty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForWithEmpty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
