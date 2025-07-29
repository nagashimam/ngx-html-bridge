import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfWithoutElse } from './if-without-else';

describe('IfWithoutElse', () => {
  let component: IfWithoutElse;
  let fixture: ComponentFixture<IfWithoutElse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IfWithoutElse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IfWithoutElse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
