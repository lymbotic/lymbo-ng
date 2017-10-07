import {Component, Input, OnInit} from '@angular/core';
import {Stack} from '../../model/stack.model';
import {Card} from '../../model/card.model';

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
