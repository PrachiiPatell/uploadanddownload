import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

interface FileListItem {
  filename: string;
  url: string;
  downloadProgress: number;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
  private selectedFile: File;
  public uploadProgress: number = null;
  public fileList: FileListItem[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post('/api/files/upload', formData, {
        reportProgress: true,
        observe: 'events',
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = null;
          console.log('File uploaded successfully:', event.body);
          this.fetchFileList(); // Refresh file list after upload
        }
      });
    }
  }

  fetchFileList(): void {
    this.http.get('/api/files/list').subscribe((files: FileListItem[]) => {
      this.fileList = files;
    });
  }

  onDownload(file: FileListItem): void {
    this.http.get(file.url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    }).subscribe(event => {
      if (event.type === HttpEventType.DownloadProgress) {
        file.downloadProgress = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
        file.downloadProgress = null;
        console.log('File downloaded successfully:', file.filename);
        const blob = new Blob([event.body], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}