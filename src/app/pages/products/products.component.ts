import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';

declare var Razorpay: any;

// All valid Bhopal pincodes
const BHOPAL_PINCODES = [
  '462001', '462002', '462003', '462004', '462006', '462007',
  '462008', '462010', '462011', '462012', '462013', '462014',
  '462015', '462016', '462018', '462020', '462021', '462022',
  '462023', '462024', '462025', '462026', '462027', '462030',
  '462031', '462032', '462033', '462034', '462036', '462037',
  '462038', '462039', '462040', '462041', '462042', '462043',
  '462044', '462045', '462046', '462047', '462049'
];

const DELIVERY_CHARGE = 99;
const FREE_DELIVERY_QTY = 3;   // free delivery if 3+ items

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  private razorpayKeyId = 'rzp_live_TEToAny6caifuF';
  private apiUrl = 'https://satvik-sanctuary-backend.onrender.com/api/orders';

  // ── UI state ──────────────────────────────────────────────
  showBuyerForm = false;
  showSuccess = false;
  isSubmitting = false;
  activeSection: string | null = null;

  // ── Cart ──────────────────────────────────────────────────
  cart: { product: Product; quantity: number }[] = [];

  // ── Buyer form ────────────────────────────────────────────
  buyer = { name: '', email: '', phone: '', address: '', pincode: '' };

  // ── Pincode state ─────────────────────────────────────────
  pincodeStatus: 'empty' | 'checking' | 'bhopal' | 'other' | 'invalid' = 'empty';

  // ── Confirmed order (shown in success popup) ──────────────
  confirmedOrder: {
    productName: string;
    quantity: number;
    productTotal: number;
    deliveryCharge: number;
    totalPaid: number;
    paymentId: string;
  } | null = null;

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

  constructor(private http: HttpClient) { }

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }

  // ── CART METHODS ──────────────────────────────────────────

  getCartQty(product: Product): number {
    const item = this.cart.find(c => c.product.id === product.id);
    return item ? item.quantity : 0;
  }

  addToCart(product: Product): void {
    const item = this.cart.find(c => c.product.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  removeFromCart(product: Product): void {
    const item = this.cart.find(c => c.product.id === product.id);
    if (!item) return;
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cart = this.cart.filter(c => c.product.id !== product.id);
    }
  }

  get totalItems(): number {
    return this.cart.reduce((sum, c) => sum + c.quantity, 0);
  }

  get productTotal(): number {
    return this.cart.reduce(
      (sum, c) => sum + (c.product.amountInPaise / 100) * c.quantity, 0
    );
  }

  // ── PINCODE LOGIC ─────────────────────────────────────────

  get isBhopal(): boolean {
    return this.pincodeStatus === 'bhopal';
  }

  get deliveryCharge(): number {
    // Free if Bhopal pincode OR 3+ items
    if (this.totalItems >= FREE_DELIVERY_QTY) return 0;
    if (this.isBhopal) return 0;
    if (this.pincodeStatus === 'other') return DELIVERY_CHARGE;
    return 0;
  }

  get grandTotal(): number {
    return this.productTotal + this.deliveryCharge;
  }

  get grandTotalInPaise(): number {
    return this.grandTotal * 100;
  }

  onPincodeInput(): void {
    const pin = this.buyer.pincode.trim();

    if (pin.length === 0) {
      this.pincodeStatus = 'empty';
      return;
    }
    if (pin.length < 6) {
      this.pincodeStatus = 'checking';
      return;
    }
    if (pin.length === 6 && /^\d{6}$/.test(pin)) {
      this.pincodeStatus = BHOPAL_PINCODES.includes(pin) ? 'bhopal' : 'other';
    } else {
      this.pincodeStatus = 'invalid';
    }
  }

  get deliveryMessage(): string {
    if (this.totalItems >= FREE_DELIVERY_QTY) {
      return '🎉 Free delivery! (3+ items)';
    }
    switch (this.pincodeStatus) {
      case 'empty': return 'Enter pincode to check delivery charges';
      case 'checking': return 'Enter 6-digit pincode...';
      case 'bhopal': return '🎉 Free delivery to Bhopal!';
      case 'other': return `🚚 Delivery charges: ₹${DELIVERY_CHARGE}`;
      case 'invalid': return '⚠ Please enter a valid 6-digit pincode';
      default: return '';
    }
  }

  get deliveryMessageClass(): string {
    if (this.totalItems >= FREE_DELIVERY_QTY) return 'msg-free';
    switch (this.pincodeStatus) {
      case 'bhopal': return 'msg-free';
      case 'other': return 'msg-paid';
      case 'invalid': return 'msg-error';
      default: return 'msg-neutral';
    }
  }

  // ── OPEN BUYER FORM ───────────────────────────────────────

  openBuyerForm(): void {
    if (this.cart.length === 0) return;
    this.buyer = { name: '', email: '', phone: '', address: '', pincode: '' };
    this.pincodeStatus = 'empty';
    this.showBuyerForm = true;
  }

  closeBuyerForm(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showBuyerForm = false;
    }
  }

  // ── PROCEED TO PAYMENT ────────────────────────────────────

  proceedToPayment(): void {
    if (!this.buyer.name || !this.buyer.email ||
      !this.buyer.phone || !this.buyer.address ||
      this.pincodeStatus === 'empty' ||
      this.pincodeStatus === 'checking' ||
      this.pincodeStatus === 'invalid') {
      return;
    }
    this.showBuyerForm = false;
    setTimeout(() => this.launchRazorpay(), 300);
  }

  // ── RAZORPAY ──────────────────────────────────────────────

  private launchRazorpay(): void {
    if (typeof Razorpay === 'undefined') {
      alert('Payment gateway failed to load. Please refresh the page.');
      return;
    }

    const options = {
      key: this.razorpayKeyId,
      amount: this.grandTotalInPaise,
      currency: 'INR',
      name: 'Satvik Sanctuary',
      description: this.cart.map(c => `${c.product.name} x${c.quantity}`).join(', '),
      image: 'assets/images/logo.png',
      prefill: {
        name: this.buyer.name,
        email: this.buyer.email,
        contact: this.buyer.phone
      },
      theme: { color: '#B8860B' },
      handler: (response: any) => {
        this.saveOrderToBackend(response.razorpay_payment_id);
      },
      modal: {
        ondismiss: () => console.log('Payment cancelled')
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (r: any) => {
        alert(`Payment failed: ${r.error.description}`);
      });
      rzp.open();
    } catch (e) {
      alert('Could not open payment window. Please refresh and try again.');
    }
  }

  // ── SAVE ORDER TO BACKEND ─────────────────────────────────

  private saveOrderToBackend(paymentId: string): void {
    this.isSubmitting = true;

    const payload = {
      buyerName: this.buyer.name,
      buyerEmail: this.buyer.email,
      buyerPhone: this.buyer.phone,
      buyerAddress: `${this.buyer.address}, ${this.buyer.pincode}`,
      productName: this.cart.map(c => `${c.product.name} x${c.quantity}`).join(', '),
      productId: this.cart[0].product.id,
      amountPaid: this.grandTotal,
      deliveryCharge: this.deliveryCharge,
      razorpayPaymentId: paymentId
    };

    const snapshot = {
      productName: payload.productName,
      quantity: this.totalItems,
      productTotal: this.productTotal,
      deliveryCharge: this.deliveryCharge,
      totalPaid: this.grandTotal,
      paymentId: paymentId
    };

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.confirmedOrder = snapshot;
        this.cart = [];
        this.showSuccess = true;
      },
      error: () => {
        this.isSubmitting = false;
        this.confirmedOrder = snapshot;
        this.cart = [];
        this.showSuccess = true;
      }
    });
  }
}
