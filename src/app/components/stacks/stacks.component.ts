import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Stack} from '../../model/stack.model';
import {StacksService} from '../../services/stacks.service';
import {DropResult, SUCCESS} from '../file-drop/file-drop.component';
import {Subject} from 'rxjs/Subject';
import {SnackbarService} from '../../services/snackbar.service';
import {MatDialog, MatIconRegistry, MatSidenav} from '@angular/material';
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

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'));
  }


  ngOnInit() {
    this.stacks = [];
    this.stacksService.fetch();

    this.dropContent.asObservable().subscribe((result) => {
      this.stacksService.createStack(result);
    });

    this.stacksService.stacksSubject
      .takeUntil(this.stacksUnsubscribeSubject)
      .subscribe((value) => {
        if (value != null) {
          this.stacks = value;
        } else {
          this.stacks = [];
        }
      });
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
            this.stacksService.createStack(result as Stack);
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
