import { Component } from "@angular/core";
import { TableModule } from "./table/table.module";
import { IRowData } from "./table/table.component";

@Component({
  selector: 'x-table-demo',
  template: '<xd-table [data]="data"></xd-table>',
  standalone: true,
  imports: [TableModule],
  styles: [
    `
      .xd-table {
        height: 300px;
      }
    `
  ]
})
export class TableDemoComponent {

  data: IRowData[];

  constructor(){

    const length = 3000;

    this.data = new Array(length);

    for(let i = 0; i < length; i++){
      this.data[i] = {
        id: i,
        title: `Title ${String(i).padStart(9, '0')}`,
        col1: (Math.random() * 1000).toFixed(3),
      };
    }

  }

}