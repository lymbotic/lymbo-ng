import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CardsService} from '../../../services/cards.service';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styles: [require('./tag-dialog.component.scss')],
})
export class TagDialogComponent implements OnInit {
  dialogTitle = '';

  constructor(private cardsService: CardsService,
              public dialogRef: MatDialogRef<TagDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));
  }

  ngOnInit() {
    this.cardsService.getAllTags();
  }

  applyTags() {
    this.dialogRef.close('');
  }
}
