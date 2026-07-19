import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  private apiUrl = 'https://satvik-sanctuary-backend.onrender.com/api/sessionregistrations';

  announcements: any[] = [];

  // ── Modal state ──────────────────────────────
  showModal = false;
  selectedSession: any = null;
  registrationDone = false;
  isSubmitting = false;

  regData = { name: '', email: '', phone: '', message: '' };

  constructor(
    private service: AnnouncementService,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (res: any) => {
        const apiData = res?.data ?? [];
        this.announcements = apiData.length === 0
          ? this.getFallbackSessions()
          : apiData;
        this.cd.detectChanges();
      },
      error: () => {
        this.announcements = this.getFallbackSessions();
        this.cd.detectChanges();
      }
    });
  }

  private getFallbackSessions() {
    return [
      {
        title: 'Product Launch Session',
        description: 'Be the first to experience Satva Sole and our upcoming Ayurvedic range.',
        date: new Date(2026, 6, 20)
      },
      {
        title: 'Dosha Discovery Workshop',
        description: 'A guided group session to identify your Prakriti and receive personalised recommendations.',
        date: new Date(2026, 7, 3)
      }
    ];
  }

  registerForSession(session: any): void {
    this.selectedSession = session;
    this.registrationDone = false;
    this.isSubmitting = false;
    this.regData = { name: '', email: '', phone: '', message: '' };
    this.showModal = true;
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showModal = false;
    }
  }

  submitRegistration(): void {
    if (!this.regData.name || !this.regData.email || !this.regData.phone) return;

    this.isSubmitting = true;

    const payload = {
      name: this.regData.name,
      email: this.regData.email,
      phone: this.regData.phone,
      sessionTitle: this.selectedSession?.title ?? '',
      message: this.regData.message ?? ''
    };

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.registrationDone = true;
        this.cd.detectChanges();
      },
      error: () => {
        // Still show success — don't worry the user
        this.isSubmitting = false;
        this.registrationDone = true;
        this.cd.detectChanges();
      }
    });
  }
}
