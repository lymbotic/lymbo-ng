import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnackbarService} from '../../../services/snackbar.service';
import {StacksService} from '../../../services/stacks.service';
import {StackDialogComponent} from '../../../view/dialogs/stack-dialog/stack-dialog.component';
import {Stack} from '../../../model/stack.model';
import {ConfirmationDialogComponent} from '../../../view/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styles: [require('./stack.component.scss')]
})
export class StackComponent implements OnInit {
  @Input() stack;

  constructor(private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  public updateStack() {
    let dialogRef = this.dialog.open(StackDialogComponent, {disableClose: true, data: {stack: this.stack}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.stacksService.updateStack(result as Stack);
        this.snackbarService.showSnackbar('Updated stack', '');
      }
    });
  }

  public deleteStack() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: 'Delete stack',
        text: 'Do you want to delete this stack?',
        action: 'Delete',
        value: this.stack
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.stacksService.deleteStack(result as Stack);
        this.snackbarService.showSnackbar('Deleted stack', '');
      }
    });
  }

}
