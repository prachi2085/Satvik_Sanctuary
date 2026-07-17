import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'healthform',
    loadComponent: () =>
      import('./pages/health-form/health-form.component')
        .then(m => m.HealthFormComponent)
    //canActivate: [authGuard]
  },

  {
    path: 'booking',
    loadComponent: () =>
      import('./pages/booking/booking.component')
        .then(m => m.BookingComponent),
    canActivate: [authGuard]
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component')
        .then(m => m.ProductsComponent)
  }
];
