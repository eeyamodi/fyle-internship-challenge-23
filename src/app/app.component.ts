import { Component } from '@angular/core';
import { ApiService, Pagination } from './services/api.service';
import { Repo } from './repo/repo.interface';
import { User } from './user/user.interface';
import { PageSelectorOptions } from './pageselector/pageselector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  user: User | undefined;
  repos: Repo[];
  title: string;
  paginationOptions: Pagination;
  pageSelectorOptions: PageSelectorOptions;

  constructor(
    private apiService: ApiService
  ) {
    this.pageSelectorOptions = {
      currentPage: 1,
      minPage: 1,
      maxPage: 5,
      per_page: 10
    };
    this.title = 'fyle-frontend-challenge';
    this.repos = [];
    this.paginationOptions = new Pagination();
  }

  changePage(page: number) {
    if (this.user) {
      this.paginationOptions.page = page;
      this.apiService.getRepos(this.user.repos_url, this.paginationOptions).subscribe((response) => {
        let newPaginationOptions = { ...this.paginationOptions, page };
        let newPageSelectorOptions = { ...this.pageSelectorOptions };
        this.repos = [...response.data];
        newPaginationOptions.page = response.page;
        newPaginationOptions.per_page = response.per_page;
        newPaginationOptions.last_page = response.total_pages;
        newPageSelectorOptions.currentPage = response.page;
        newPageSelectorOptions.minPage = Math.max(1, newPaginationOptions.page - 4);
        newPageSelectorOptions.maxPage = Math.min(newPageSelectorOptions.minPage + 10, newPaginationOptions.last_page, newPaginationOptions.page + 4);
        newPageSelectorOptions.per_page = response.per_page;
        this.pageSelectorOptions = newPageSelectorOptions;
        this.paginationOptions = newPaginationOptions;
      });
    }
  }

  search(searchTerm: string) {
    this.apiService.getUser(searchTerm).subscribe((user: User) => {
      this.user = user;
      this.apiService.getRepos(user.repos_url, new Pagination()).subscribe((response) => {
        let newPageSelectoroptions = { ...this.pageSelectorOptions };
        let newPaginationOptions = { ...this.paginationOptions };
        this.repos = response.data;
        newPaginationOptions.page = response.page;
        newPaginationOptions.per_page = response.per_page;
        newPaginationOptions.last_page = response.total_pages;
        newPageSelectoroptions.currentPage = response.page;
        newPageSelectoroptions.minPage = Math.max(1, newPaginationOptions.page - 4);
        newPageSelectoroptions.maxPage = Math.min(newPageSelectoroptions.minPage + 10,
          newPaginationOptions.last_page, newPaginationOptions.page + 4);
        newPageSelectoroptions.per_page = response.per_page;
        this.pageSelectorOptions = newPageSelectoroptions;
        this.paginationOptions = newPaginationOptions;
      });
    });
  }

  changePerPage(per_page: number) {
    this.paginationOptions = { ...this.paginationOptions, per_page };
    this.changePage(1);
  }
}
