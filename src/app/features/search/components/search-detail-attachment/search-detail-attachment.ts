import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
 selector: 'app-search-detail-attachment',
 standalone:true,
 imports:[
   CommonModule,
   MatIconModule,
   MatButtonModule
 ],
 templateUrl:'./search-detail-attachment.html',
 styleUrls: ['./search-detail-attachment.scss']

})
export class SearchDetailAttachment {


 @Input({required:true})
 attachments!: any[];


 formatSize(size:number):string {

   if(size < 1024){
     return `${size} bytes`;
   }

   if(size < 1024 * 1024){
     return `${Math.round(size / 1024)} KB`;
   }

   return `${Math.round(size / 1024 / 1024)} MB`;

 }

}