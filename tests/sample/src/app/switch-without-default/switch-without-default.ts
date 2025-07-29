import { Component } from '@angular/core';

@Component({
  selector: 'app-switch-without-default',
  imports: [],
  templateUrl: './switch-without-default.html',
  styleUrl: './switch-without-default.scss'
})
export class SwitchWithoutDefault {
  switchValue: number = 1;
}
