import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, FormsModule],   // ← FormsModule needed for ngModel
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  announcements: any[] = [];

  // ─── Modal state ────────────────────────────────
  showModal = false;
  selectedSession: any = null;
  registrationDone = false;
  isSubmitting = false;

  regData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  constructor(
    private service: AnnouncementService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (res: any) => {
        const apiData = res?.data ?? [];
        if (apiData.length === 0) {
          this.announcements = this.getFallbackSessions();
        } else {
          this.announcements = apiData;
        }
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
        description: 'Be the first to experience Satva Sole and our upcoming Ayurvedic range. Live demo, Q&A with practitioners.',
        date: new Date(2026, 6, 20)
      },
      {
        title: 'Dosha Discovery Workshop',
        description: 'A guided group session to identify your Prakriti and receive personalised diet & lifestyle recommendations.',
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
    // Close only if clicking the dark overlay, not the modal box itself
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showModal = false;
    }
  }

  submitRegistration(): void {
    if (!this.regData.name || !this.regData.email || !this.regData.phone) return;

    this.isSubmitting = true;

    // ─── TODO: replace setTimeout with your real API call ──────────────
    // this.bookingService.book({
    //   sessionTitle: this.selectedSession.title,
    //   sessionDate: this.selectedSession.date,
    //   ...this.regData
    // }).subscribe({ next: () => { this.registrationDone = true; } });

    setTimeout(() => {
      this.isSubmitting = false;
      this.registrationDone = true;
      this.cd.detectChanges();
    }, 1200);
  }
}
