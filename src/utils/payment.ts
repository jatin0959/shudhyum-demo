import { toast } from 'sonner';
import { apiService } from '../services/apiService';
import { User } from '../contexts/AppContext';

export async function handleRazorpayPayment(
  orderDetails: { orderId: string; amount: number },
  user: User
) {
  try {
    const response = await apiService.createRazorpayOrder(
      orderDetails.orderId, 
      orderDetails.amount
    );

    if (!response.success) {
      toast.error(response.error || 'Failed to create order');
      return;
    }

    const options = {
      key: response.data.keyId,
      amount: response.data.amount,
      currency: response.data.currency,
      name: 'Shudhyum',
      description: 'Order Payment',
      order_id: response.data.id,
      handler: async (response: any) => {
        console.log('Payment successful:', response);
        toast.success('Payment successful!');
      },
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phone
      },
      theme: {
        color: '#16a34a'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  }
}