"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Globe, DollarSign, IndianRupee } from "lucide-react";

// Currency conversion rates (in a real app, you'd fetch these from an API)
const EXCHANGE_RATES = {
  USD: 1,
  INR: 83.50, // 1 USD = 83.50 INR (approximate rate)
  EUR: 0.92,  // 1 USD = 0.92 EUR (approximate rate)
  GBP: 0.80,  // 1 USD = 0.80 GBP (approximate rate)
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
};

const CURRENCY_ICONS = {
  USD: DollarSign,
  INR: IndianRupee,
  EUR: DollarSign, // Using DollarSign as fallback
  GBP: DollarSign, // Using DollarSign as fallback
};

interface CurrencyConverterProps {
  className?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ className }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof EXCHANGE_RATES>('USD');
  const [isOpen, setIsOpen] = useState(false);

  const currencies = Object.keys(EXCHANGE_RATES) as Array<keyof typeof EXCHANGE_RATES>;

  const convertPrice = (usdPrice: number) => {
    const converted = usdPrice * EXCHANGE_RATES[selectedCurrency];
    return {
      amount: converted.toFixed(2),
      symbol: CURRENCY_SYMBOLS[selectedCurrency],
      currency: selectedCurrency
    };
  };

  const IconComponent = CURRENCY_ICONS[selectedCurrency];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Globe className="w-4 h-4" />
        <span>Currency:</span>
      </div>
      
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 min-w-[80px]"
        >
          <IconComponent className="w-4 h-4" />
          <span>{selectedCurrency}</span>
        </Button>
        
        {isOpen && (
          <Card className="absolute top-full left-0 mt-1 z-50 min-w-[120px] shadow-lg">
            <CardContent className="p-1">
              {currencies.map((currency) => {
                const CurrencyIcon = CURRENCY_ICONS[currency];
                return (
                  <Button
                    key={currency}
                    variant={selectedCurrency === currency ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start gap-2 text-xs"
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setIsOpen(false);
                    }}
                  >
                    <CurrencyIcon className="w-3 h-3" />
                    <span>{currency}</span>
                    <span className="ml-auto text-muted-foreground">
                      {CURRENCY_SYMBOLS[currency]}
                    </span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export { CurrencyConverter, EXCHANGE_RATES, CURRENCY_SYMBOLS };
export type { CurrencyConverterProps };