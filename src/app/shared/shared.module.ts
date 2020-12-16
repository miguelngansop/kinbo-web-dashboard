import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './accordion';
import {ExportDataComponent} from './export-data/export-data.component';
import {ImageUploadComponent} from './image-upload/image-upload.component';
import {LoadImageComponent} from './load-image/load-image.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ExportDataComponent,
    ImageUploadComponent,
    LoadImageComponent
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ExportDataComponent,
    ImageUploadComponent,
    LoadImageComponent
  ],
    imports: [
        MatMenuModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        CommonModule,
        FlexModule
    ],
  providers: [MenuItems]
})
export class SharedModule {}
