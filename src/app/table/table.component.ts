import { CdkScrollable } from "@angular/cdk/scrolling";
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { BehaviorSubject, Subject, auditTime, combineAll, debounceTime, merge } from "rxjs";

export interface IRowData {
  id: number;
  title: string;
  col1?: string;
}

@Component({
  selector: 'xd-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
  host: {
    class: 'xd-table'
  }
})
export class TableComponent<T extends IRowData> implements OnDestroy, AfterViewInit {

  @Input()
  set data(data: T[]){
    this._data = data;
    this._dataChange.next();
  }

  @Input()
  rowHeight = 40;

  @ViewChild(CdkScrollable)
  scrollable!: CdkScrollable;

  _dataChange = new Subject<void>();
  _renderedData: T[] = [];
  _data: T[] = [];
  _spaceStart = 0;
  _spaceEnd = 0;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeRef: ChangeDetectorRef
  ){}

  ngAfterViewInit(): void {

    merge(
      this.scrollable.elementScrolled(),
      this._dataChange
    )
    .pipe(auditTime(10))
    .subscribe(() => {
      this.updateRender()
    });

    this.updateRender();
  }


  ngOnDestroy(): void {
    this._dataChange.complete();
  }

  updateRender(){
    const buffer = 20;

    let viewportHeight = this.elementRef.nativeElement.clientHeight;
    let scrollTop = this.scrollable.measureScrollOffset('top');
    let topIndex = scrollTop / this.rowHeight;
    let bottomIndex = topIndex + (viewportHeight / this.rowHeight) - 1;
    let renderIndexTop = Math.round(Math.max(topIndex - buffer, 0));
    let renderIndexBottom = Math.round(Math.min(bottomIndex + buffer, this._data.length));
    
    this._renderedData = this._data.slice(
      renderIndexTop, 
      renderIndexBottom
    );
    this._spaceStart = renderIndexTop * this.rowHeight;
    this._spaceEnd = (this._data.length - renderIndexBottom) * this.rowHeight;

    this.changeRef.detectChanges();
  }
}