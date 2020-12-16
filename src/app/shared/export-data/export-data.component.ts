import {Component, Input, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {

  @Input() data:any[];
  @Input() name:string;

  constructor() { }

  ngOnInit() {
  }

  exportToExcelOrCSV(extension:string) {
    if(this.data){
      const ws : XLSX.WorkSheet =  XLSX.utils.json_to_sheet(this.data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb,ws,this.name? this.name : 'Tableur 1');
      XLSX.writeFile(wb,this.name? this.name+'.'+extension : 'Classeur.'+extension);
    }
  }
}
