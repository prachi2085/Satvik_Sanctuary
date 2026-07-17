import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';

declare var Razorpay: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  private razorpayKeyId = 'rzp_test_PASTE_YOUR_KEY_HERE';
  private apiUrl = 'https://satvik-sanctuary-backend.onrender.com/api/orders';

  // ── Modal visibility ──────────────────────────────────────
  showBuyerForm = false;
  showSuccess = false;
  isSubmitting = false;

  selectedProduct: Product | null = null;

  // Confirmed order data shown in success popup
  confirmedOrder: { productName: string; amountPaid: number; paymentId: string } | null = null;

  buyer = { name: '', email: '', phone: '', address: '' };

  products: Product[] = [
    {
      id: 1,
      name: 'Satva Sole',
      description: 'Nourish your feet. Calm your mind. Restore your balance.',
      price: '₹299',
      offerPrice: '₹149',
      amountInPaise: 14900,
      discount: '50% OFF',
      image: 'assets/images/satva-sole.png',
      badge: 'New Launch',
      whatsappMessage: ''
    }
  ];

  activeSection: string | null = null;

  constructor(private http: HttpClient) { }

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }

  // STEP 1 — Buy Now clicked → open buyer form popup
  openBuyerForm(product: Product): void {
    this.selectedProduct = product;
    this.buyer = { name: '', email: '', phone: '', address: '' };
    this.showBuyerForm = true;
  }

  // Close buyer form when clicking dark overlay
  closeBuyerForm(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showBuyerForm = false;
    }
  }

  // STEP 2 — Buyer form submitted → close form → open Razorpay
  proceedToPayment(): void {
    if (!this.buyer.name || !this.buyer.email ||
      !this.buyer.phone || !this.selectedProduct) return;

    this.showBuyerForm = false;

    // Small delay so popup closes cleanly before Razorpay opens
    setTimeout(() => this.launchRazorpay(this.selectedProduct!), 300);
  }

  // STEP 3 — Open Razorpay checkout
  private launchRazorpay(product: Product): void {
    if (typeof Razorpay === 'undefined') {
      alert('Payment gateway failed to load. Please refresh the page.');
      return;
    }

    const options = {
      key: this.razorpayKeyId,
      amount: product.amountInPaise,
      currency: 'INR',
      name: 'Satvik Sanctuary',
      description: product.name,
      image: 'assets/images/logo.png',
      prefill: {
        name: this.buyer.name,
        email: this.buyer.email,
        contact: this.buyer.phone
      },
      theme: { color: '#B8860B' },
      handler: (response: any) => {
        // STEP 4 — Payment done → save to backend
        this.saveOrderToBackend(product, response.razorpay_payment_id);
      },
      modal: {
        ondismiss: () => console.log('Payment cancelled by user')
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (r: any) => {
        alert(`Payment failed: ${r.error.description}\n\nPlease try again.`);
      });
      rzp.open();
    } catch (e) {
      console.error('Razorpay error:', e);
      alert('Could not open payment window. Please refresh and try again.');
    }
  }

  // STEP 4 — POST to backend → save order + send emails → show success popup
  private saveOrderToBackend(product: Product, paymentId: string): void {
    this.isSubmitting = true;

    const payload = {
      buyerName: this.buyer.name,
      buyerEmail: this.buyer.email,
      buyerPhone: this.buyer.phone,
      buyerAddress: this.buyer.address,
      productName: product.name,
      productId: product.id,
      amountPaid: product.amountInPaise / 100,
      razorpayPaymentId: paymentId
    };

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.confirmedOrder = {
          productName: product.name,
          amountPaid: product.amountInPaise / 100,
          paymentId: paymentId
        };
        this.showSuccess = true;   // ← shows the success popup
      },
      error: () => {
        this.isSubmitting = false;
        // Payment went through even if backend had an error
        this.confirmedOrder = {
          productName: product.name,
          amountPaid: product.amountInPaise / 100,
          paymentId: paymentId
        };
        this.showSuccess = true;   // still show success — payment was real
      }
    });
  }
}
