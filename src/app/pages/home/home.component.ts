import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { AnnouncementComponent } from '../announcement/announcement.component';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AnnouncementComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  articles: any[] = [];
  //constructor(private articleService: ArticleService) { }
  latestArticle: any;
  loading = true;


  constructor(
    private articleService: ArticleService,
    private cd: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    console.log("HOME INIT");



    this.articleService.getAll().subscribe({
      next: (res: any) => {
        console.log("FULL RESPONSE:", res);

        const data = Array.isArray(res)
          ? res
          : res?.data ?? [];

        this.articles = data.slice(0, 3);

        console.log("FINAL ARTICLES:", this.articles);

        this.cd.detectChanges();   // 👈 ADD THIS LINE
      },
      error: (err) => {
        console.error("ERROR:", err);
        this.articles = [];
        this.cd.detectChanges();   // 👈 ADD THIS TOO
      }
    });
  }

  openArticle(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  openVideo(url: string) {
    window.open(url, '_blank');
  }

}
