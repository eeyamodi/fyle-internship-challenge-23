import { Component, Input } from '@angular/core';
import { User } from '../user/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent {
  @Input() user: User | undefined;
}