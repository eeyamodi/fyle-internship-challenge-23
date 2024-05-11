import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepocardComponent } from './repocard.component';
import { Repo } from '../repo/repo.interface';

describe('RepocardComponent', () => {
  let component: RepocardComponent;
  let fixture: ComponentFixture<RepocardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RepocardComponent]
    });
    fixture = TestBed.createComponent(RepocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have an input property "repo"', () => {
    expect(component.repo).toBeUndefined();
  });

  it('should display the repo name', () => {
    const repo: Repo = {
      name: 'Test Repo',
      description: 'test description',
      topics: ['topic 1','topic 2']
    };
    component.repo = repo;
    fixture.detectChanges();
    const repoNameElement = fixture.nativeElement.querySelector('#name');
    expect(repoNameElement.textContent).toContain(repo.name);
  });

  it('should display the repo description', () => {
    const repo: Repo = {
      name: 'Test Repo',
      description: 'test description',
      topics: ['topic 1','topic 2']
    };
    component.repo = repo;
    fixture.detectChanges();
    const repoNameElement = fixture.nativeElement.querySelector('#description');
    expect(repoNameElement.textContent).toContain(repo.description);
  })
  
});
