import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './components/progress-bar/pages/progress-bar.component';
import { MaterialModule } from '../material.module';
import { ToolBarComponent } from './components/banner/page/tool-bar.component';


@NgModule({
  declarations: [ProgressBarComponent, ToolBarComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [MaterialModule, ProgressBarComponent, ToolBarComponent]
})
export class SharedModule { }
