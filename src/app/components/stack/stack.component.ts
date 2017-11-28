import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styles: [require('./stack.component.scss')]
})
export class StackComponent implements OnInit {
  @Input() stack;

  constructor() {
  }

  ngOnInit() {
  }

}
