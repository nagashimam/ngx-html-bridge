import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attr } from './attr';

describe('Attr', () => {
  let component: Attr;
  let fixture: ComponentFixture<Attr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Attr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
