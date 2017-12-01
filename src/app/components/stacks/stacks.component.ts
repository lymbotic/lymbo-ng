import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Stack} from '../../model/stack.model';
import {StacksService} from '../../services/stacks.service';
import {DropResult, SUCCESS} from '../file-drop/file-drop.component';
import {Subject} from 'rxjs/Subject';
import {SnackbarService} from '../../services/snackbar.service';
import {MatIconRegistry, MdDialog, MdSidenav} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {StackDialogComponent} from '../stack-dialog/stack-dialog.component';

@Component({
  selector: 'app-stacks',
  templateUrl: './stacks.component.html',
  styles: [require('./stacks.component.scss')]
})
export class StacksComponent implements OnInit, OnDestroy {
  title = 'Lymbo';
  stacks: Stack[] = [];
  dropContent: Subject<Stack> = new Subject();
  private stacksUnsubscribeSubject = new Subject();

  @ViewChild('sidenav') sidenav: MdSidenav;

  constructor(private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MdDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'));
  }


  ngOnInit() {
    this.dropContent.asObservable().subscribe((result) => {
      this.stacksService.addStack(result);
    });

    this.stacksService.stacksSubject
      .takeUntil(this.stacksUnsubscribeSubject)
      .subscribe((value) => {
        if (value != null) {
          this.stacks.push(value as Stack);
        } else {
          this.stacks = [];
        }
      });
    this.stacksService.stacksDeleteSubject
      .takeUntil(this.stacksUnsubscribeSubject)
      .subscribe((value) => {
        if (value != null) {
          this.stacks = this.stacks.filter(s => s.id !== (value as Stack).id);
        }
      });

    this.stacksService.publish();
  }

  ngOnDestroy(): void {
    this.stacksUnsubscribeSubject.next();
    this.stacksUnsubscribeSubject.complete();
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
      case 'add': {
        let dialogRef = this.dialog.open(StackDialogComponent, {disableClose: true});
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.stacksService.addStack(result as Stack);
            this.snackbarService.showSnackbar('Added stack', '');
          }
        });
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
