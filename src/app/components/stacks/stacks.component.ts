import {Component, OnInit} from '@angular/core';
import {Stack} from '../../model/stack.model';
import {StacksService} from '../../services/stacks.service';

@Component({
  selector: 'app-stacks',
  templateUrl: './stacks.component.html',
  styles: [require('./stacks.component.scss')]
})
export class StacksComponent implements OnInit {
  stacks: Stack[] = [];

  constructor(private stacksService: StacksService) {

    this.stacksService.stacksSubject.subscribe((value) => {
      if (value != null) {
        this.stacks.push(value as Stack);
      } else {
        this.stacks = [];
      }
    });
  }

  ngOnInit() {
  }

}
