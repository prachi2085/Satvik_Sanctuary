import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HealthFormService } from '../../services/health-form.service';
import { HealthForm } from '../../models/health-form.model';

@Component({
  selector: 'app-health-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './health-form.component.html',
  styleUrls: ['./health-form.component.scss']
})
export class HealthFormComponent {

  form: HealthForm = {
    name: '',
    age: undefined,
    email: '',// ✅ No initial 0
    contactNumber: '',
    symptoms: '',
    message: ''
  };

  submitted = false;
  isSubmitting = false;      // ✅ prevents double submit

  constructor(private healthFormService: HealthFormService) { }

  submitForm(formRef: NgForm) {

    if (formRef.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.submitted = false;

    this.healthFormService.submit(this.form).subscribe({
      next: () => {
        this.submitted = true;
        this.isSubmitting = false;

        // Proper Angular reset
        formRef.resetForm();

        // Reset object manually to avoid undefined binding issues
        this.form = {
          name: '',
          age: undefined,
          email:'',
          contactNumber: '',
          symptoms: '',
          message: ''
        };
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }
}
