import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PageselectorComponent, PageSelectorOptions } from './pageselector.component';

describe('PageselectorComponent', () => {
  let component: PageselectorComponent;
  let fixture: ComponentFixture<PageselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PageselectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageselectorComponent);
    component = fixture.componentInstance;
    component.options = {
      minPage: 1,
      maxPage: 10,
      currentPage: 1,
      per_page: 10
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pageChange event when changePage is called with valid page', () => {
    spyOn(component.pageChange, 'emit');
    component.changePage(5);
    expect(component.pageChange.emit).toHaveBeenCalledWith(5);
  });

  it('should not emit pageChange event when changePage is called with invalid page', () => {
    spyOn(component.pageChange, 'emit');
    component.changePage(11);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
    component.changePage(0);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit perPageChange event when changePerPage is called', () => {
    spyOn(component.perPageChange, 'emit');
    const event = { target: { value: '20' } };
    component.changePerPage(event);
    expect(component.perPageChange.emit).toHaveBeenCalledWith(20);
  });

  it('should emit correct perPageChange even when changePage is called with invalid perPage',() => {
    spyOn(component.perPageChange,'emit');
    const event1 = {target: {value: '101'}};
    component.changePerPage(event1);
    expect(component.perPageChange.emit).toHaveBeenCalledWith(100);
    const event2 = {target: {value: '9'}};
    component.changePerPage(event2);
    expect(component.perPageChange.emit).toHaveBeenCalledWith(10);
  })

  it('should generate array from range correctly', () => {
    const array = component.arrayFromRange(2, 7);
    expect(array).toEqual([ 2, 3, 4, 5,6,7]);
  });
});