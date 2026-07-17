import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';

// Tells TypeScript that Razorpay exists as a global variable from index.html
declare var Razorpay: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  // ── 🔑 PASTE YOUR RAZORPAY KEY HERE ──────────────────────────────────
  private razorpayKeyId = 'rzp_live_TEToAny6caifuF';
  private apiUrl = 'https://satvik-sanctuary-backend.onrender.com/api/orders';

  // ── Modal state ───────────────────────────────────────────────────────
  showBuyerForm = false;
  selectedProduct: Product | null = null;
  isSubmitting = false;

  buyer = { name: '', email: '', phone: '', address: '' };

  products: Product[] = [
    {
      id: 1,
      name: 'Satva Sole',
      description: 'Nourish your feet. Calm your mind. Restore your balance.',
      price: '₹299',
      offerPrice: '₹149',
      amountInPaise: 14900,       // ₹149 × 100 = 14900 paise
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

  // STEP 1 — Buy Now clicked → open the buyer details form
  openBuyerForm(product: Product): void {
    this.selectedProduct = product;
    this.buyer = { name: '', email: '', phone: '', address: '' };
    this.showBuyerForm = true;
  }

  // Close modal when clicking the dark overlay
  closeBuyerForm(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showBuyerForm = false;
    }
  }

  // STEP 2 — Buyer form submitted → open Razorpay
  proceedToPayment(): void {
    if (!this.buyer.name || !this.buyer.email || !this.buyer.phone || !this.selectedProduct) {
      alert('Please fill all required fields.');
      return;
    }

    this.showBuyerForm = false;

    // Small delay so modal closes cleanly before Razorpay overlay opens
    setTimeout(() => this.launchRazorpay(this.selectedProduct!), 300);
  }

  // STEP 3 — Launch Razorpay checkout
  private launchRazorpay(product: Product): void {

    // Safety check — if script didn't load, tell user clearly
    if (typeof Razorpay === 'undefined') {
      alert('Payment gateway failed to load. Please check your internet connection and refresh the page.');
      return;
    }

    const options = {
      key: this.razorpayKeyId,
      amount: product.amountInPaise,   // must be in paise
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
        // STEP 4 — Payment succeeded, save to backend
        this.saveOrderToBackend(product, response.razorpay_payment_id);
      },
      modal: {
        ondismiss: () => {
          console.log('Razorpay modal closed by user');
        }
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

  // STEP 4 — Save order to your .NET backend (saves to DB + sends emails)
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
        alert(
          `✅ Order confirmed!\n\n` +
          `A confirmation email has been sent to ${this.buyer.email}.\n` +
          `We'll dispatch your order within 2–3 business days.`
        );
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Backend error after payment:', err);
        // Payment already went through — don't alarm the customer
        alert(
          `✅ Payment received! (ID: ${paymentId})\n\n` +
          `There was a minor issue sending your confirmation email.\n` +
          `Please contact sattviksanctuary@gmail.com with your payment ID.`
        );
      }
    });
  }
}
