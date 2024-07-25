import { NgModule } from "@angular/core";
import { TableComponent } from "./table.component";
import {ScrollingModule} from '@angular/cdk/scrolling';


@NgModule({
  imports: [ScrollingModule],
  declarations: [TableComponent],
  exports: [TableComponent]
})
export class TableModule {

}