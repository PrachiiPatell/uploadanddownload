import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import {saveAs} from 'file-saver';
import { FileService } from './file.service';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fileId: any;
  fileStatus= {status:'', requestType:'',percent:0};

  // title = 'uploadanddownload';
  constructor(private fileService:FileService){}
  onUploadFiles(files:File[]):void{
    const formData=new FormData();
    for(const file of files){formData.append('files',file ,file.name);}

    this.fileService.upload(formData).subscribe(
event=>{
  console.log(event); 
  this.reportProgress(event);
}, 
(error:HttpErrorResponse)=> {
  
  console.log(error);
}
);
  }


  onDownloadFiles(fileId:any):void{
    

    this.fileService.download(fileId).subscribe(
event=>{
  console.log(event); 
  this.reportProgress(event);
}, 
(error:HttpErrorResponse)=> {
  
  console.log(error);
}
);
  }




  private reportProgress(httpEvent: HttpEvent<string[] | Blob>) :void {
   switch(httpEvent.type){
    case HttpEventType.UploadProgress:
      this.updateStatus(httpEvent.loaded,httpEvent.total!,'Uploading');
      break;

      case HttpEventType.DownloadProgress:
      this.updateStatus(httpEvent.loaded,httpEvent.total!,'Downloading');
      break;

      case HttpEventType.ResponseHeader:
      console.log('Header returned',httpEvent);
      break;

      case HttpEventType.Response:
      if(httpEvent.body instanceof Array){
        this.fileStatus.status = 'done';
for(const fileId of httpEvent.body){
  this.fileId.unshift(fileId);
}
      }else{
// saveAs(new File([httpEvent.body],httpEvent.headers.get('fileId'),
// {type:'${httpEvent.headers.get('contentType')}'}));  
saveAs(new File([httpEvent.body!], httpEvent.headers.get('fileId')!, 
                  {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
      }
      this.fileStatus.status = 'done';
      break;
          default:
            console.log(httpEvent);
            break;
   } }
  private updateStatus(loaded: number, total: number,requestType: string):void {
    //throw new Error('Method not implemented.');
    this.fileStatus.status='progress';
    this.fileStatus.requestType= requestType;
    this.fileStatus.percent=Math.round(100 * loaded / total);
  }
 
  }
 

  
 

