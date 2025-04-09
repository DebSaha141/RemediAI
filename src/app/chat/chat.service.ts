import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class ChatService {
    private apiUrl = '/api/chat';
  
    constructor(private http: HttpClient) {}
  
    getMedicalResponse(query: string) {
      return this.http.post(this.apiUrl, { prompt: query });
    }
  }