import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, Pagination } from './api.service';
import { User } from '../user/user.interface';
import { Repo } from '../repo/repo.interface';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data', () => {
    localStorage.clear();
    const mockUser: User = {
      name: "Shikhar Maheshwari",
      avatar_url: "https://avatars.githubusercontent.com/u/83123897?v=4",
      html_url: "https://github.com/shikhar-sm",
      repos_url: "https://api.github.com/users/shikhar-sm/repos",
      bio: "I am a full stack developer with a passion for learning and teaching.",
      location: null,
      twitter_username: null
    };

    service.getUser('testUser').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('https://api.github.com/users/testUser');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should fetch repos', () => {
    localStorage.clear();
    const mockRepos: Repo[] = [];
    const mockPagination = new Pagination();

    service.getRepos('https://api.github.com/users/testUser/repos', mockPagination).subscribe(response => {
      expect(response.data).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(req => req.url.includes('https://api.github.com/users/testUser/repos'));
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos );
  });

  it('should cache user requests', () => {
    localStorage.clear()
    const username = 'testUser'

    const mockUser: User = {
      name: "Shikhar Maheshwari",
      avatar_url: "https://avatars.githubusercontent.com/u/83123897?v=4",
      html_url: "https://github.com/shikhar-sm",
      repos_url: "https://api.github.com/users/shikhar-sm/repos",
      bio: "I am a full stack developer with a passion for learning and teaching.",
      location: null,
      twitter_username: null
    };

    service.getUser(username).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('https://api.github.com/users/testUser');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    service.getUser(username).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    httpMock.expectNone('https://api.github.com/users/testUser');
  })

  it('should cache repos requests', () => {
    localStorage.clear();
    const mockRepos: Repo[] = [];
    const mockPagination = new Pagination();

    service.getRepos('https://api.github.com/users/testUser/repos', mockPagination).subscribe(response => {
      expect(response.data).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(req => req.url.includes('https://api.github.com/users/testUser/repos'));
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos );

    service.getRepos('https://api.github.com/users/testUser/repos', mockPagination).subscribe(response => {
      expect(response.data).toEqual(mockRepos);
    });

    httpMock.expectNone('https://api.github.com/users/testUser/repos')
  })

  it('should fetch last page from response header',() => {
    localStorage.clear();
    const mockRepos: Repo[] = [];
    const mockPagination = new Pagination();
    
    service.getRepos('https://api.github.com/users/testUser/repos', mockPagination).subscribe(response => {
      expect(response.data).toEqual(mockRepos);
      expect(response.total_pages).toEqual(mockPagination.page)
    });
    
    const req1 = httpMock.expectOne(req => req.url.includes('https://api.github.com/users/testUser/repos'));
    expect(req1.request.method).toBe('GET');
    req1.flush(mockRepos,{
      headers:
      {Link:'<https://api.github.com/user/83123897/repos?page=1&per_page=10>; rel="prev", <https://api.github.com/user/83123897/repos?page=1&per_page=10>; rel="first"'}
    } );
    localStorage.clear();
    
    service.getRepos('https://api.github.com/users/testUser/repos', mockPagination).subscribe(response => {
      expect(response.data).toEqual(mockRepos);
      expect(response.total_pages).toEqual(10);
    });

    const req2 = httpMock.expectOne(req => req.url.includes('https://api.github.com/users/testUser/repos'));
    expect(req2.request.method).toBe('GET');
    req2.flush(mockRepos,{
      headers:
      {Link:'<https://api.github.com/user/83123897/repos?page=1&per_page=10>; rel="prev", <https://api.github.com/user/83123897/repos?page=10&per_page=10>; rel="last"'}
    } );

  }) 

});