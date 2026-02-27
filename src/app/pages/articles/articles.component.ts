import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {

  articles$: Observable<any[]>;

  constructor(private articleService: ArticleService) {
    this.articles$ = this.articleService.getAll();
  }

  openArticle(url: string) {
    window.open(url, '_blank');
  }
}
