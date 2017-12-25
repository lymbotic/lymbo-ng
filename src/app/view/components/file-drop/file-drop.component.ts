import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable, Subject, Subscription} from 'rxjs';
import {Stack} from '../../../model/stack.model';
import {Card} from '../../../model/card.model';
import {Tag} from '../../../model/tag.model';
import {UUID} from '../../../model/util/uuid';

const URL = 'https://foo.bar.com';

export const SUCCESS = 'success';
export const FAILURE = 'failure';

export interface DropResult {
  result: 'failure' | 'success';
  payload: any;
}

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styles: [require('./file-drop.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDropComponent implements OnInit, OnDestroy {

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasDropZoneOver = false;
  private subscription: Subscription;
  private filesSubject: Subject<File>;
  private uploadedFilesObservable: Observable<{ result: string, payload: any }>;

  @Output()
  public uploadedFiles: EventEmitter<DropResult> = new EventEmitter();

  static parseLymboFile(value: string): Stack {
    if (value.trim().startsWith('{')) {
      return FileDropComponent.parseJsonLymboFile(value);
    } else {
      return FileDropComponent.parseCsvLymboFile(value);
    }
  }

  static parseJsonLymboFile(value: string): Stack {
    return JSON.parse(value);
  }

  static parseCsvLymboFile(value: string): Stack {
    let cards = [];
    value.split('\n').forEach(c => {
      let vs = c.split(',');
      let card = new Card();

      card.id = new UUID().toString();
      card.sides[0].title = vs[0];
      card.sides[1].title = vs[1];
      card.tags = vs.splice(2, vs.length).map(v => {
        return new Tag(v.trim().replace('\r', ''), true);
      });

      cards.push(card);
    });

    let stack = new Stack();
    stack.id = new UUID().toString();
    stack.title = `stack ${stack.id}`;
    stack.cards = cards;
    stack.tags = [];

    return stack;
  }

  constructor() {
    this.filesSubject = new Subject();
    this.uploadedFilesObservable = this.filesSubject.asObservable()
      .switchMap((file: File) => {
        return new Observable<any>((observer) => {
          let reader: FileReader = new FileReader();
          reader.onload = (e) => {
            observer.next((e.target as any).result);
          };
          reader.readAsBinaryString(file);
          return () => {
            reader.abort();
          };
        }).map((value: string) => {
          return FileDropComponent.parseLymboFile(value);
        }).map((results: any) => {
          return {result: SUCCESS, payload: results};
        })
          .catch(e => Observable.of({result: FAILURE, payload: e}));
      });
  }

  ngOnInit() {
    this.subscription = this.uploadedFilesObservable.subscribe(this.uploadedFiles);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public fileOverBase(e: any): void {
    this.hasDropZoneOver = e;
  }

  public fileDropped(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.filesSubject.next(files[i]);
    }
  }
}
