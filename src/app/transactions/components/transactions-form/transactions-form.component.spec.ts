import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsFormComponent } from './transactions-form.component';

describe('TransactionsFormComponent', () => {
  let component: TransactionsFormComponent;
  let fixture: ComponentFixture<TransactionsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
