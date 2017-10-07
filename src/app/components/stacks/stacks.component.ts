import {Component, OnInit} from '@angular/core';
import {Stack} from '../../model/stack.model';
import {StacksService} from '../../services/stacks.service';
import {Card} from '../../model/card.model';
import {DropResult, SUCCESS} from '../file-drop/file-drop.component';
import {MdSnackBar} from '@angular/material';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-stacks',
  templateUrl: './stacks.component.html',
  styles: [require('./stacks.component.scss')]
})
export class StacksComponent implements OnInit {
  stacks: Stack[] = [];

  dropContent: Subject<Stack> = new Subject();

  constructor(private stacksService: StacksService, public snackBar: MdSnackBar) {
    this.dropContent.asObservable().subscribe((result) => {
      this.stacksService.addStack(result);
    });

    this.stacksService.stacksSubject.subscribe((value) => {
      if (value != null) {
        this.stacks.push(value as Stack);
      } else {
        this.stacks = [];
      }
    });
  }

  ngOnInit() {
    let stack = new Stack();
    stack.id = '42';
    stack.title = '42';

    let card = new Card();
    card.id = '42';
    card.title = '42';

    stack.cards.push(card);

    console.log(JSON.stringify(stack));
  }

  public uploadedFiles(result: DropResult) {
    if (result.result == SUCCESS) {
      this.dropContent.next(result.payload);
    } else {
      this.openSnackBar('ERROR: Failed to parse dropped file.', '');
    }
  }

  /**
   * Handles messages that shall be displayed in a snack bar
   * @param message
   * @param action
   */
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
