import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { SavedAddresses } from "../components/checkout/SavedAddresses";
import { Separator } from "../ui/separator";
import { ShippingForm } from "../components/checkout/ShippingForm";
import { PaymentMethodSelector } from "../components/checkout/PaymentMethodSelector";
import { OrderSummary } from "../components/checkout/OrderSummary";
import Layout from "../components/layout";

export type PaymentMethod = "stripe" | "razorpay" | "upi" | "cod";

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<ShippingDetails[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("savedAddresses");
    if (stored) {
      const addresses = JSON.parse(stored);
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        setSelectedAddressId(0);
        setShippingDetails(addresses[0]);
      } else {
        setShowAddressForm(true);
      }
    } else {
      // Add mock addresses for testing
      const mockAddresses: ShippingDetails[] = [
        {
          fullName: "John Doe",
          email: "john@example.com",
          phone: "9876543210",
          address: "123 Main Street, Apartment 4B",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001"
        },
        {
          fullName: "John Doe",
          email: "john@example.com",
          phone: "9876543210",
          address: "456 Park Avenue, Floor 2",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001"
        }
      ];
      setSavedAddresses(mockAddresses);
      setSelectedAddressId(0);
      setShippingDetails(mockAddresses[0]);
      localStorage.setItem("savedAddresses", JSON.stringify(mockAddresses));
    }
  }, []);

  // Mock cart items
  const cartItems = [
    { id: 1, name: "Premium Headphones", price: 2999, quantity: 1, image: "/placeholder.svg" },
    { id: 2, name: "Wireless Mouse", price: 899, quantity: 2, image: "/placeholder.svg" },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleSelectAddress = (index: number) => {
    setSelectedAddressId(index);
    setShippingDetails(savedAddresses[index]);
  };

  const handleShippingSubmit = (details: ShippingDetails) => {
    const updatedAddresses = [...savedAddresses];
    if (selectedAddressId !== null && showAddressForm) {
      updatedAddresses.push(details);
    } else if (showAddressForm) {
      updatedAddresses.push(details);
    }
    setSavedAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
    setShippingDetails(details);
    setShowAddressForm(false);
    setStep("payment");
  };

  const handleContinueToPayment = () => {
    if (shippingDetails) {
      setStep("payment");
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Order Placed Successfully!",
        description: `Your order will be processed via ${paymentMethod.toUpperCase()}`,
      });
      navigate("/order-confirmation", { 
        state: { 
          orderId: `ORD${Date.now()}`,
          shippingDetails,
          paymentMethod,
          total 
        } 
      });
    }, 1500);
  };

  return (
    <Layout>
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Shipping Information</h2>
                {step === "payment" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setStep("shipping")}
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              {step === "shipping" ? (
                <div className="space-y-4">
                  <SavedAddresses 
                    addresses={savedAddresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={handleSelectAddress}
                  />
                  
                  {!showAddressForm && savedAddresses.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowAddressForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  )}

                  {showAddressForm && (
                    <div className="space-y-3">
                      {savedAddresses.length > 0 && (
                        <Separator className="my-4" />
                      )}
                      <ShippingForm onSubmit={handleShippingSubmit} />
                    </div>
                  )}

                  {!showAddressForm && shippingDetails && (
                    <Button 
                      className="w-full" 
                      onClick={handleContinueToPayment}
                    >
                      Continue to Payment
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{shippingDetails?.fullName}</p>
                  <p className="text-muted-foreground">{shippingDetails?.email}</p>
                  <p className="text-muted-foreground">{shippingDetails?.phone}</p>
                  <p className="text-muted-foreground">{shippingDetails?.address}</p>
                  <p className="text-muted-foreground">
                    {shippingDetails?.city}, {shippingDetails?.state} - {shippingDetails?.pincode}
                  </p>
                </div>
              )}
            </Card>

            {/* Payment Method */}
            {step === "payment" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                <PaymentMethodSelector 
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary 
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
            
            {step === "payment" && (
              <Button 
                className="w-full mt-4" 
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Place Order - ₹${total}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Checkout;
