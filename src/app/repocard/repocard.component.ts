import { Component, Input } from '@angular/core';
import { Repo } from '../repo/repo.interface';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-repocard',
  imports: [
    CommonModule
  ],
  templateUrl: './repocard.component.html',
  styleUrls: ['./repocard.component.scss']
})
export class RepocardComponent {
  @Input() repo: Repo | undefined;
}