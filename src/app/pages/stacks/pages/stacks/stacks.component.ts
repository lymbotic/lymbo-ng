import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {MatDialog, MatDialogConfig, MatSidenav} from '@angular/material';
import {takeUntil} from 'rxjs/internal/operators';
import {Stack} from '../../../../core/entity/model/stack.model';
import {StacksService} from '../../../../core/entity/services/stacks.service';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {StackDialogComponent} from '../../components/dialogs/stack-dialog/stack-dialog.component';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {environment} from '../../../../../environments/environment';

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

  public windowHeight = 0;
  public windowWidth = 0;

  constructor(private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = event.target.innerHeight;
    this.windowWidth = event.target.innerWidth;
  }

  ngOnInit() {
    this.stacks = [];
    this.stacksService.fetch();

    this.dropContent.asObservable().subscribe((result) => {
      this.stacksService.createStack(result);
    });

    this.stacksService.stacksSubject.pipe(
      takeUntil(this.stacksUnsubscribeSubject)
    ).subscribe((value) => {
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
        this.snackbarService.showSnackbar('Clicked on menu item Settings');
        break;
      }

      case 'add': {
        let dialogRef = this.dialog.open(StackDialogComponent, {disableClose: true});
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.stacksService.createStack(result as Stack);
            this.snackbarService.showSnackbar('Added stack');
          }
        });
        break;
      }
      case 'about': {
        const dialogRef = this.dialog.open(AboutDialogComponent, <MatDialogConfig>{
          disableClose: true,
          data: {
            title: 'About',
            name: environment.NAME,
            version: environment.VERSION,
            license: environment.LICENSE,
            homepage: environment.HOMEPAGE,
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
    this.snackbarService.showSnackbar(`Clicked on side menu item ${menuItem}`);
  }
}
