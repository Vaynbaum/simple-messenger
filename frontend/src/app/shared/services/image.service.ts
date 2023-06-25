import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BACKEND_URL_IMAGE, IMAGE_DEFAULT_URL } from '../urls';
import axios from 'axios';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}
  @Output() PictureUnloaded = new EventEmitter();
  GetFullURL(url?: string) {
    if (url) {
      if (url.includes('http')) {
        return url;
      } else {
        return `${BACKEND_URL_IMAGE}/${url}`;
      }
    } else {
      return IMAGE_DEFAULT_URL;
    }
  }

  async unloadPicture(token: string, formData: FormData) {
    return axios.post(`${BACKEND_URL_IMAGE}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async UnloadPicture(fileImg: any) {
    let formData = new FormData();
    formData.append('file', fileImg);
    try {
      const { data } = await this.unloadPicture(
        this.authService.GetAccessToken(),
        formData
      );
      this.PictureUnloaded.emit(data);
    } catch (error: any) {
      if (error.status === 401 || error.status === 403) {
        let sub = this.authService.TokenRefreshed.subscribe(async () => {
          sub.unsubscribe();
          try {
            const { data } = await this.unloadPicture(
              this.authService.GetAccessToken(),
              formData
            );
            this.PictureUnloaded.emit(data);
          } catch (error: any) {
            this.PictureUnloaded.emit(null);
          }
        });
        this.authService.RefreshToken();
      }
    }
  }

  private deleteOldImage(token: string, img?: string) {
    let url = `${BACKEND_URL_IMAGE}`;
    if (img) url += `?filename=${img}`;
    return this.httpClient.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  DeleteOldImage(img?: string) {
    return new Observable((observer) => {
      this.deleteOldImage(this.authService.GetAccessToken(), img).subscribe(
        (response) => {
          observer.next(response);
        },
        (err) => {
          if (err.status === 401 || err.status === 403) {
            this.authService.RefreshToken();
            let sub = this.authService.TokenRefreshed.subscribe(() => {
              sub.unsubscribe();
              this.deleteOldImage(
                this.authService.GetAccessToken(),
                img
              ).subscribe(
                (response) => observer.next(response),
                (err) => observer.next(err)
              );
            });
          }
        }
      );
    });
  }
}
