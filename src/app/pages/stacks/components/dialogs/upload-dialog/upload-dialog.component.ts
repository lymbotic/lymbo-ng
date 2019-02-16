import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs';
import {DropResult, SUCCESS} from '../../fragments/file-drop-fragment/file-drop-fragment.component';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {PouchDBService} from '../../../../../core/persistence/services/pouchdb.service';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {STACK_PERSISTENCE} from '../../../../../core/entity/entity.module';
import {StacksPersistenceService} from '../../../../../core/entity/services/stack/persistence/stacks-persistence.interface';

/**
 * Displays upload dialog
 */
@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Entities retrieved from dropped file */
  dropContent: Subject<Stack> = new Subject();

  /**
   * Constructor
   * @param pouchDBService PouchDB service
   * @param snackbarService snackbar service
   * @param stacksPersistenceService stacks persistence service
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private pouchDBService: PouchDBService,
              private snackbarService: SnackbarService,
              @Inject(STACK_PERSISTENCE) private stacksPersistenceService: StacksPersistenceService,

              public dialogRef: MatDialogRef<UploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.dialogTitle = this.data.title;

    this.dropContent.asObservable().subscribe((result) => {
      this.stacksPersistenceService.uploadStack(result as Stack);
    });
  }

  //
  // Actions
  //

  /**
   * Handles files dropped into the dropzone
   * @param {DropResult} result drop result
   */
  public onFilesUploaded(result: DropResult) {
    if (result.result.toString().toLowerCase() === SUCCESS) {
      this.dropContent.next(result.payload);
    } else {
      this.snackbarService.showSnackbar('ERROR: Failed to parse dropped file.');
    }
  }
}
