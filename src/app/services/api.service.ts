import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, of } from 'rxjs';
import { User } from '../user/user.interface';
import { Repo } from '../repo/repo.interface';

export interface PaginationResponse<T> {
  page: number;
  per_page: number;
  total_pages: number;
  data: T[];
}

export class Pagination {
  page: number;
  per_page: number;
  last_page: number;
  constructor(page: number = 1, per_page: number = 10,last_page: number = 1) {
    this.page = page;
    this.per_page = per_page;
    this.last_page = last_page;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  getUser(githubUsername: string): Observable<User> {
    const cacheKey = githubUsername;

    if (isPlatformBrowser(this.platformId)) {
      const cachedResponse = localStorage.getItem(cacheKey);
      if(cachedResponse) {
        return of(JSON.parse(cachedResponse));
      }
    }
    return this.httpClient.get<User>(`https://api.github.com/users/${githubUsername}`).pipe(
      map((response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(cacheKey,JSON.stringify(response))
        }
    
        return response;
      })
    );
  }

  // implement getRepos method by referring to the documentation. Add proper types for the return type and params 
  getRepos(url:string,paginationOptions: Pagination): Observable<PaginationResponse<Repo>> {
    const cacheKey = url + 'page:' + paginationOptions.page + 'perpage:' + paginationOptions.per_page;

    if (isPlatformBrowser(this.platformId)) {
      const cachedResponse = localStorage.getItem(cacheKey);
      if(cachedResponse) {
        return of(JSON.parse(cachedResponse));
      }
    }

    return this.httpClient.get<any>(url,{
      headers: {
        'Accept': 'application/vnd.github+json'
      },
      params: {
        page: paginationOptions.page.toString(),
        per_page: paginationOptions.per_page.toString()
      },
      observe: 'response',
    }).pipe(
      map((response) => {
        let linkheaders = response.headers.get('link');
        let lastpage = linkheaders?.split(',').find((link: string) => link.includes('rel="last"'))?.split(';')[0].match(/page=(\d+)/)?.[1];
        const paginatedresponse = {
          page: paginationOptions.page as number,
          per_page: paginationOptions.per_page as number,
          total_pages: lastpage ? parseInt(lastpage) : paginationOptions.page as number,
          data: response.body as Repo[]
        } as PaginationResponse<Repo>;

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(cacheKey,JSON.stringify(paginatedresponse));
        }

        return paginatedresponse
      },
    ))
    ;
  }
}
