<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

declare global {
  interface Window {
    Razorpay: any;
  }
}

export {};