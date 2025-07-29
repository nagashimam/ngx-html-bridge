import { Component } from '@angular/core';

@Component({
  selector: 'app-for-with-empty',
  imports: [],
  templateUrl: './for-with-empty.html',
  styleUrl: './for-with-empty.scss'
})
export class ForWithEmpty {
  items: string[] = [];
}
