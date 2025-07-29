import { Component } from '@angular/core';

@Component({
  selector: 'app-if',
  imports: [],
  templateUrl: './if.html',
  styleUrl: './if.scss'
})
export class If {
  condition: boolean = true;
  elseIfCondition: boolean = false;
}
