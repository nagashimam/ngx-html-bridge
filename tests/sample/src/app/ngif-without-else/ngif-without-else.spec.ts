import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgifWithoutElse } from './ngif-without-else';

describe('NgifWithoutElse', () => {
  let component: NgifWithoutElse;
  let fixture: ComponentFixture<NgifWithoutElse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgifWithoutElse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgifWithoutElse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
