
import React, { useState } from 'react';
import { Button,buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { motion } from 'framer-motion';
import { initiatePayment, verifyPayment } from '@/utils/payment';
import { toast } from '@/hooks/use-toast';
import {
  Check,
  Crown,
  Star,
  Zap,
  Shield,
  Users,
  Headphones,
  BarChart3,
  ArrowRight,
  AlertCircle,
  CreditCard
} from 'lucide-react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { cn } from "@/lib/utils";




const Payment = () => {
  const { user, updateSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 999,
      originalPrice: 1499,
      period: 'month',
      description: 'Perfect for small teams getting started',
      icon: Zap,
      isPopular: false,
      features: [
        'Up to 100 tickets/month',
        'Basic reporting',
        'Email support',
        '2 team members',
        'Standard integrations'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 2999,
      originalPrice: 4499,
      period: 'month',
      description: 'Ideal for growing businesses',
      icon: Crown,
      isPopular: true,
      features: [
        'Up to 1000 tickets/month',
        'Advanced reporting & analytics',
        'Priority support',
        '10 team members',
        'Custom integrations',
        'SLA management',
        'Custom workflows'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 5999,
      originalPrice: 8999,
      period: 'month',
      description: 'For large organizations with complex needs',
      icon: Shield,
      isPopular: false,
      features: [
        'Unlimited tickets',
        'Enterprise reporting',
        '24/7 dedicated support',
        'Unlimited team members',
        'Custom integrations & API',
        'Advanced SLA management',
        'Custom branding',
        'SSO & advanced security'
      ]
    }
  ];

  const handlePayment = async (plan: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase a plan",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(plan.id);

    try {
      await initiatePayment({
        amount: plan.price * 100, // Convert to paise
        name: "ServiceDesk Pro",
        description: `${plan.name} Plan - Monthly Subscription`,
        handler: async (response: any) => {
          try {
            console.log('Payment Response:', response);

            // Verify payment
            const verification = await verifyPayment(
              response.razorpay_payment_id,
              response.order_id,
              response.razorpay_signature
            );

            if (verification.success) {
              // Update user subscription status
              const subscriptionData = {
                planId: plan.id,
                planName: plan.name,
                status: 'active' as const,
                startDate: new Date().toISOString(),
                amount: plan.price,
              };

              updateSubscription(subscriptionData);

              toast({
                title: "Payment Successful!",
                description: `Welcome to ServiceDesk Pro ${plan.name} plan!`,
              });

              // Store subscription details in localStorage as backup
              localStorage.setItem('servicedesk_subscription', JSON.stringify({
                ...subscriptionData,
                paymentId: response.razorpay_payment_id,
                orderId: response.order_id,
                signature: response.razorpay_signature,
              }));

              // Redirect to dashboard after successful payment
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 2000);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support for assistance.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '',
        },
        theme: {
          color: '#3B82F6'
        }
      });
    } catch (error: any) {
      console.error('Payment Error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (

    <>

      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="container py-20">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground text-lg whitespace-pre-line">
                Unlock the full potential of ServiceDesk Pro with features designed to scale with your business needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 30,
                    delay: 0.4,
                    opacity: { duration: 0.5 },
                  }}
                  className={cn(
                    `rounded-2xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
                    plan.isPopular ? "border-green-400 border-2" : "border-border",
                    "flex flex-col",
                    !plan.isPopular && "mt-5",
                    index === 0 || index === 2
                      ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                      : "z-10",
                    index === 0 && "origin-right",
                    index === 2 && "origin-left"
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-green-400 py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                      <Star className="text-primary-foreground h-4 w-4 fill-current" />
                      <span className="text-primary-foreground ml-1 font-sans font-semibold">
                        Popular
                      </span>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <p className="text-base font-semibold text-muted-foreground">
                      {plan.name}
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-foreground">
                        {plan.price}
                      </span>
                      {plan.period !== "Next 3 months" && (
                        <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                          / {plan.period}
                        </span>
                      )}
                    </div>

                    <ul className="mt-5 gap-2 flex flex-col">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-left">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <hr className="w-full my-4" />

                    <Button
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                        }),
                        "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                        "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
                        plan.isPopular
                          ? "bg-green-400 text-primary-foreground hover:bg-green-500"
                          : "bg-background text-foreground"
                      )}
                      disabled={isProcessing && selectedPlan === plan.id}
                      onClick={() => handlePayment(plan)}>
                      {isProcessing && selectedPlan === plan.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay with Razorpay
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>


                    <p className="mt-6 text-xs leading-5 text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

    </>

  );
};

export default Payment;
