import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FileService {
private server='http://localhost:8080';
  constructor(private http:HttpClient) { }

  upload(formData:FormData):Observable<HttpEvent<string[]>>{
    return this.http.post<string[]>('${this.server}/files',formData,{

reportProgress:true,
observe:'events'

    });
  }

  download(fileId:any):Observable<HttpEvent<Blob>>{
    return this.http.get('${this.server}/files/${fileId}',{
  
reportProgress:true,
observe:'events',
responseType:'blob'
    });

  }
}
