"use client";

import {
  CreditCard,
  Wallet,
  Landmark,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Info,
  Plus,
  Ticket,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "mvola" | "bank";

export default function PaymentView({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("mvola");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-700">
      {/* 1. PAYMENT OPTIONS CARD */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group">
        <div className="p-8 border-b border-gray-50 bg-[#fcfdfd]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#2d9e4f] text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg shadow-green-100">
              2
            </div>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 leading-tight">
                Secure payment
              </h2>
              <p className="text-sm text-gray-400 font-medium tracking-tight">
                Select your preferred payment method below
              </p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Method Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "mvola",
                label: "MVola / Orange Money",
                icon: Wallet,
                sub: "instant mobile pay",
              },
              {
                id: "card",
                label: "Credit / Debit Card",
                icon: CreditCard,
                sub: "Visa, Mastercard",
              },
              {
                id: "bank",
                label: "Bank Transfer",
                icon: Landmark,
                sub: "Direct deposit",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMethod(item.id as PaymentMethod)}
                className={cn(
                  "relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center group/btn",
                  method === item.id
                    ? "border-[#2d9e4f] bg-[#eaf7ee]/30 shadow-md"
                    : "border-gray-100 bg-white hover:border-[#d2ead6] hover:bg-[#fcfdfd]",
                )}
              >
                {method === item.id && (
                  <div className="absolute top-3 right-3 text-[#2d9e4f]">
                    <CheckCircle2
                      size={18}
                      fill="currentColor"
                      className="text-[#eaf7ee]"
                    />
                  </div>
                )}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    method === item.id
                      ? "bg-[#2d9e4f] text-white"
                      : "bg-gray-50 text-gray-400 group-hover/btn:bg-[#eaf7ee] group-hover/btn:text-[#2d9e4f]",
                  )}
                >
                  <item.icon size={24} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800 tracking-tight">
                    {item.label}
                  </p>
                  <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest mt-1 opacity-60">
                    {item.sub}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Dynamic Method Details */}
          <div className="bg-[#fcfdfd] border border-gray-100 rounded-3xl p-8 space-y-8 animate-in fade-in zoom-in duration-500">
            {method === "mvola" && (
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#2d9e4f] shadow-sm shrink-0">
                    <Plus size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-serif font-black text-gray-900 leading-none">
                      Enter your mobile number
                    </h4>
                    <p className="text-[12px] text-gray-400 font-medium">
                      We&apos;ll send a confirmation prompt to your phone
                    </p>
                  </div>
                </div>
                <div className="flex items-center border border-gray-200 rounded-2xl h-14 overflow-hidden bg-white focus-within:border-[#2d9e4f] transition-all shadow-sm max-w-md mx-auto md:mx-0">
                  <div className="flex items-center px-6 gap-2 border-r border-gray-100 font-semibold text-gray-500">
                    +261
                  </div>
                  <input
                    type="tel"
                    placeholder="034 XX XXX XX"
                    className="flex-1 px-6 text-sm font-semibold text-gray-800 placeholder:text-gray-300 outline-none"
                  />
                </div>
              </div>
            )}

            {method === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                    CARD NUMBER
                  </label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-6 text-sm font-semibold text-gray-800 placeholder:text-gray-200 focus:border-[#2d9e4f] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                    EXPIRY DATE
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-6 text-sm font-semibold text-gray-800 placeholder:text-gray-200 focus:border-[#2d9e4f] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    placeholder="***"
                    className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-6 text-sm font-semibold text-gray-800 placeholder:text-gray-200 focus:border-[#2d9e4f] outline-none"
                  />
                </div>
              </div>
            )}

            {method === "bank" && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-3 text-[#2d9e4f] mb-2">
                  <Info size={16} />
                  <span className="text-xs font-semibold uppercase tracking-widest leading-none">
                    Bank Details
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div className="space-y-1">
                    <p className="text-gray-400 font-semibold uppercase text-[9px]">
                      Bank Name
                    </p>
                    <p className="text-gray-900 font-black">
                      Bank of Madagascar
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-semibold uppercase text-[9px]">
                      Account Number
                    </p>
                    <p className="text-gray-900 font-black">
                      0000 1234 5678 90
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold mt-4 leading-relaxed uppercase tracking-tight">
                  Please include your Booking Reference (BDL-20482) in the
                  transaction note.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. PROMO CODE CARD */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8 group">
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-[#eaf7ee] group-hover:text-[#2d9e4f] transition-all duration-500">
          <Ticket size={24} />
        </div>
        <div className="flex-1 text-center md:text-left space-y-0.5">
          <h4 className="text-lg font-serif font-black text-gray-900 leading-none">
            Apply Promo Code
          </h4>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">
            Have a coupon? Save more on your booking.
          </p>
        </div>
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl h-14 overflow-hidden w-full md:w-auto shadow-inner">
          <input
            type="text"
            placeholder="Enter code"
            className="bg-transparent px-6 text-sm font-semibold text-gray-800 placeholder:text-gray-300 outline-none w-full md:w-32"
          />
          <button className="h-full px-6 bg-white border-l border-gray-100 text-[#2d9e4f] font-black text-xs uppercase tracking-widest hover:bg-[#2d9e4f] hover:text-white transition-all">
            Apply
          </button>
        </div>
      </div>

      {/* 3. FINAL ACTION CARD */}
      <div className="bg-white rounded-[2.5rem] shadow-lg border border-gray-100 p-8 space-y-8 animate-in slide-in-from-bottom duration-1000">
        <div className="bg-[#fcfcfc] p-6 rounded-2xl border border-gray-100 flex gap-4 items-start">
          <ShieldCheck className="text-[#2d9e4f] mt-0.5" size={18} />
          <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
            By clicking &quot;Complete Booking&quot;, you acknowledge that you
            have read and agreed to the{" "}
            <span className="font-semibold text-[#2d9e4f] underline">
              Payment Terms
            </span>{" "}
            and that your payment information is encrypted and secure.
          </p>
        </div>

        <button
          onClick={handlePay}
          disabled={isProcessing}
          className={cn(
            "w-full bg-[#2d9e4f] text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-100 group transition-all",
            isProcessing
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[#268c44] hover:scale-[1.01] active:scale-[0.99]",
          )}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-white" />
          ) : (
            <>
              <CheckCircle2
                size={22}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Complete booking</span>
              <ChevronRight
                size={22}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
            Total to pay today: <span className="text-gray-800 font-currency">Ar 900</span>
          </p>
        </div>
      </div>
    </div>
  );
}
