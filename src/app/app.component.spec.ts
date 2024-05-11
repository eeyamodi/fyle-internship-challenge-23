import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { SearchComponent } from './search/search.component';
import { RepocardComponent } from './repocard/repocard.component';
import { PageSelectorOptions, PageselectorComponent } from './pageselector/pageselector.component';
import { ApiService, Pagination, PaginationResponse } from './services/api.service';
import { User } from './user/user.interface';
import { Repo } from './repo/repo.interface';
import { of } from 'rxjs';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let apiService: ApiService;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getRepos', 'getUser'])
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        UserdetailsComponent,
        SearchComponent,
        RepocardComponent,
        PageselectorComponent
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy}
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'fyle-frontend-challenge'`, () => {
    expect(app.title).toEqual('fyle-frontend-challenge');
  });

  it('should call apiService when search is called', () => {
    const userResponse: User = {
      repos_url: 'repo_url',
      html_url: 'html',
      avatar_url: 'avatar',
      name: 'name',
      bio: 'bio',
      location: 'loc',
      twitter_username: 'twitter'
    }
    const repoResponse: PaginationResponse<Repo[]> ={
      page: 1,
      per_page: 10,
      total_pages: 5,
      data: []
    };

    (apiService.getUser as jasmine.Spy).and.returnValue(of(userResponse));
    (apiService.getRepos as jasmine.Spy).and.returnValue(of(repoResponse));
    app.search('test');
    expect(apiService.getUser).toHaveBeenCalled();
    expect(apiService.getRepos).toHaveBeenCalled();
  });

  it('should call apiservice when changepage is called and user exists',() => {
    app.user = {
      repos_url: 'repo_url',
      html_url: 'html',
      avatar_url: 'avatar',
      name: 'name',
      bio: 'bio',
      location: 'loc',
      twitter_username: 'twitter'
    };

    (apiService.getRepos as jasmine.Spy).and.returnValue(of());
    app.changePage(5);
    expect(apiService.getRepos).toHaveBeenCalled();
  })

  it('should not call apiservice when changepage is called and user does not exist',() => {
    app.user = undefined;

    (apiService.getRepos as jasmine.Spy).and.returnValue(of());
    app.changePage(5);
    expect(apiService.getRepos).not.toHaveBeenCalled();
  })

  it('call changePage when changePerPage is called',() => {
    spyOn(app,'changePage');
    app.changePerPage(100);
    expect(app.changePage).toHaveBeenCalledWith(1);
  })

  it('should correctly update details of pagination and selector options',() => {
    app.user = {
      repos_url: 'repo_url',
      html_url: 'html',
      avatar_url: 'avatar',
      name: 'name',
      bio: 'bio',
      location: 'loc',
      twitter_username: 'twitter'
    };

    const repoResponse: PaginationResponse<Repo[]> ={
      page: 5,
      per_page: 10,
      total_pages: 10,
      data: []
    };

    app.paginationOptions = {
      page: 1,
      per_page: 100,
      last_page: 1
    };

    app.pageSelectorOptions = {
      minPage: 1,
      maxPage: 1,
      currentPage: 1,
      per_page: 100
    };
    

    const paginationOptions: Pagination = {
      page: 5,
      per_page: 10,
      last_page: 10
    };

    const selectorOptions: PageSelectorOptions = {
      minPage: 1,
      maxPage: 9,
      currentPage: 5,
      per_page: 10
    };

    (apiService.getRepos as jasmine.Spy).and.returnValue(of(repoResponse));
    app.changePage(5);
    expect(apiService.getRepos).toHaveBeenCalled();
    expect(app.paginationOptions).toEqual(paginationOptions);
    expect(app.pageSelectorOptions).toEqual(selectorOptions);
  })

});
