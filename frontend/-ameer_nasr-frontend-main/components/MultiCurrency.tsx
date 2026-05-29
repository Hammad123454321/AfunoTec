"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export type Currency = "USD" | "EUR" | "MGA";

interface CurrencyConfig {
  symbol: string;
  decimals: number;
}

const CURRENCY_COOKIE = "app_currency";
const CACHE_TTL_MS = 10 * 60 * 1000;
const API_TIMEOUT_MS = 5000;

const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  USD: { symbol: "$", decimals: 2 },
  EUR: { symbol: "€", decimals: 2 },
  MGA: { symbol: "Ar", decimals: 0 },
};

const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  MGA: 4600,
};

/* ============================================================================
   RATE CACHING
   ============================================================================ */

interface CacheEntry {
  timestamp: number;
  rates: Record<Currency, number>;
}

let rateCache: CacheEntry | null = null;

async function fetchExchangeRates(): Promise<Record<Currency, number>> {
  const now = Date.now();
  if (rateCache && now - rateCache.timestamp < CACHE_TTL_MS) {
    return rateCache.rates;
  }

  try {
    const response = await axios.get("/api/rates", {
      timeout: API_TIMEOUT_MS,
    });

    const rates: Record<Currency, number> = {
      USD: Number(response.data.rates?.USD ?? FALLBACK_RATES.USD),
      EUR: Number(response.data.rates?.EUR ?? FALLBACK_RATES.EUR),
      MGA: Number(response.data.rates?.MGA ?? FALLBACK_RATES.MGA),
    };

    rateCache = { timestamp: now, rates };
    return rates;
  } catch {
    if (rateCache) return rateCache.rates;
    rateCache = { timestamp: now, rates: FALLBACK_RATES };
    return FALLBACK_RATES;
  }
}

/* ============================================================================
   CONTEXT & HOOKS
   ============================================================================ */

interface CurrencyContextState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convertFromUSD: (amount: number) => number;
  formatPrice: (amountUSD: number) => string;
  rates: Record<Currency, number>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextState | undefined>(
  undefined
);

export function useCurrency(): CurrencyContextState {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}

/* ============================================================================
   PROVIDER
   ============================================================================ */

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const stored = Cookies.get(CURRENCY_COOKIE);
    return (stored as Currency) || "USD";
  });

  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);

  /* Fetch rates once on mount */
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    fetchExchangeRates()
      .then((r) => {
        if (mounted) setRates(r);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* Persist to cookie */
  useEffect(() => {
    Cookies.set(CURRENCY_COOKIE, currency, {
      expires: 365,
      sameSite: "lax",
      secure:
        typeof window !== "undefined" && window.location.protocol === "https:",
    });
  }, [currency]);

  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), []);

  const convertFromUSD = useCallback(
    (amountUSD: number): number => {
      const rate = rates[currency] ?? FALLBACK_RATES[currency];
      return amountUSD * rate;
    },
    [currency, rates]
  );

  const formatPrice = useCallback(
    (amountUSD: number): string => {
      const converted = convertFromUSD(amountUSD);
      const config = CURRENCY_CONFIG[currency];

      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: config.decimals,
          minimumFractionDigits: config.decimals,
        }).format(converted);
      } catch {
        const formatted = converted.toFixed(config.decimals);
        return `${config.symbol}${formatted}`;
      }
    },
    [convertFromUSD, currency]
  );

  const value = useMemo(
    (): CurrencyContextState => ({
      currency,
      setCurrency,
      convertFromUSD,
      formatPrice,
      rates,
      isLoading,
    }),
    [currency, setCurrency, convertFromUSD, formatPrice, rates, isLoading]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

/* ============================================================================
   CURRENCY SELECTOR
   ============================================================================ */

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="uppercase gap-1"
          translate="no"
        >
          {currency}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setCurrency(code as Currency)}
            className="capitalize"
            translate="no"
          >
            {code} {config.symbol}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ============================================================================
   PRICE COMPONENT
   ============================================================================ */

interface PriceProps {
  amountUSD: number;
  className?: string;
}

export function Price({ amountUSD, className = "" }: PriceProps) {
  const { formatPrice } = useCurrency();

  return (
    <span className={`font-semibold ${className}`}>
      {formatPrice(amountUSD)}
    </span>
  );
}

/* ============================================================================
   EXPORTS
   ============================================================================ */

export default {
  CurrencyProvider,
  CurrencySelector,
  Price,
  useCurrency,
};
