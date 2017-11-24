import {Component, OnInit, ViewChild} from '@angular/core';
import {Stack} from '../../model/stack.model';
import {StacksService} from '../../services/stacks.service';
import {DropResult, SUCCESS} from '../file-drop/file-drop.component';
import {Subject} from 'rxjs/Subject';
import {SnackbarService} from '../../services/snackbar.service';
import {MdSidenav} from '@angular/material';

@Component({
  selector: 'app-stacks',
  templateUrl: './stacks.component.html',
  styles: [require('./stacks.component.scss')]
})
export class StacksComponent implements OnInit {
  title = 'Lymbo';
  stacks: Stack[] = [];
  dropContent: Subject<Stack> = new Subject();

  @ViewChild('sidenav') sidenav: MdSidenav;

  constructor(private stacksService: StacksService,
              private snackbarService: SnackbarService) {
  }

  ngOnInit() {
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

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'menu': {
        this.sidenav.toggle();
        break;
      }
      case 'settings': {
        this.snackbarService.showSnackbar('Clicked on menu item Settings', '');
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Handles click on side menu items
   * @param menuItem
   */
  onSideMenuItemClicked(menuItem: string) {
    this.snackbarService.showSnackbar(`Clicked on side menu item ${menuItem}`, '');
  }


  public uploadedFiles(result: DropResult) {
    if (result.result == SUCCESS) {
      this.dropContent.next(result.payload);
    } else {
      this.snackbarService.showSnackbar('ERROR: Failed to parse dropped file.', '');
    }
  }

}
