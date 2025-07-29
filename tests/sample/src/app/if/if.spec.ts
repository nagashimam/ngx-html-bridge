import { ComponentFixture, TestBed } from '@angular/core/testing';

import { If } from './if';

describe('If', () => {
  let component: If;
  let fixture: ComponentFixture<If>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [If]
    })
    .compileComponents();

    fixture = TestBed.createComponent(If);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
