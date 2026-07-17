import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../services/announcement.service';
@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  announcements: any[] = [];

  constructor(
    private service: AnnouncementService,
    private cd: ChangeDetectorRef
  ) { }


  
  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (res: any) => {
        const apiData = res?.data ?? [];

        if (apiData.length === 0) {
          this.announcements = [
            {
              title: 'Upcoming Session',
              description: 'Product Launching Session',
              date: new Date(2026, 6, 20)
            }
          ];
        } else {
          this.announcements = apiData;
        }

        this.cd.detectChanges();  // 👈 VERY IMPORTANT
      },
      error: () => {
        this.announcements = [
          {
            title: 'Upcoming Session',
            description: 'Product Launching Session',
            date: new Date(2026, 6, 20)
          }
        ];

        this.cd.detectChanges();  // 👈 VERY IMPORTANT
      }
    });
  }
}
