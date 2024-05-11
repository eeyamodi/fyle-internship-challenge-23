import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'search-box',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  searchTerm:string = "";  
  @Output() search = new EventEmitter<string>();
  
  onSearch() {
    this.search.emit(this.searchTerm);
  }
}