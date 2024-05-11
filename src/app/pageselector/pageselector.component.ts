import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface PageSelectorOptions {
  minPage: number;
  maxPage: number;
  currentPage: number;
  per_page: number;
}

@Component({
  standalone: true,
  selector: 'app-pageselector',
  templateUrl: './pageselector.component.html',
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./pageselector.component.scss']
})
export class PageselectorComponent {
  @Input({required:true}) options: PageSelectorOptions | undefined;
  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();

  perPageOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ]

  arrayFromRange(min: number, max: number): number[] {
    return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  }

  changePage(page: number): void {
    if (this.options && page >= this.options.minPage && page <= this.options.maxPage && page !== this.options.currentPage) {
      this.pageChange.emit(page);
    }
  }

  changePerPage(event: any): void {
    const per_page = Math.min(Math.max(parseInt(event.target.value), 10),100);
    this.perPageChange.emit(per_page);
  }
}