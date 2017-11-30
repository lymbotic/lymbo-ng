import {Component, Input, OnInit} from '@angular/core';
import {MatIconRegistry, MdDialog} from '@angular/material';
import {SnackbarService} from '../../services/snackbar.service';
import {DomSanitizer} from '@angular/platform-browser';
import {StacksService} from '../../services/stacks.service';
import {StackDialogComponent} from '../stack-dialog/stack-dialog.component';
import {Stack} from '../../model/stack.model';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styles: [require('./stack.component.scss')]
})
export class StackComponent implements OnInit {
  @Input() stack;

  constructor(private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MdDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('more', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_black_18px.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
  }

  ngOnInit() {
  }

  public editStack() {
    let dialogRef = this.dialog.open(StackDialogComponent, {disableClose: true, data: {stack: this.stack}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.stacksService.updateStack(result as Stack);
        this.snackbarService.showSnackbar('Updated stack', '');
      }
    });
  }

}
