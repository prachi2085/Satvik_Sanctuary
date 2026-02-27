import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MediumService {

  constructor(private http: HttpClient) { }

  getArticles() {
    const rssUrl = 'https://medium.com/feed/@aniketkachhaway';

    // Use rss2json API to convert RSS to JSON
    return this.http.get(
      `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`
    );
  }
}
