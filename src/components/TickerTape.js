import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";

const TickerTape = () => {
  const { theme } = useContext(ThemeContext);
  const widgetContainerRef = useRef(null);

  useEffect(() => {
    const widgetContainer = widgetContainerRef.current;
    if (widgetContainer) {
      widgetContainer.innerHTML = "";

      // Delay script injection by 100ms to ensure the DOM is ready
      setTimeout(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
          symbols: [
            { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
            { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
            { proName: "FOREXCOM:AUDJPY", title: "AUD to JPY" },
            { proName: "FOREXCOM:EURUSD", title: "EUR to USD" },
            { proName: "FOREXCOM:GBPUSD", title: "GBP to USD" },
            { proName: "FOREXCOM:GBPJPY", title: "GBP to JPY" },
            { proName: "FOREXCOM:HKDJPY", title: "HKD to JPY" },
            { proName: "FOREXCOM:USDCAD", title: "USD to CAD" },
            { proName: "FOREXCOM:USDCHF", title: "USD to CHF" },
            { proName: "PEPPERSTONE:USDINR", title: "USD to INR" },
            { proName: "FOREXCOM:USDJPY", title: "USD to JPY" },
            { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
            { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
          ],
          showSymbolLogo: true,
          isTransparent: true,
          displayMode: "compact",
          colorTheme: theme === "dark" ? "dark" : "light",
          locale: "en",
        });
        widgetContainer.appendChild(script);
      }, 100);
    }
    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = "";
      }
    };
  }, [theme]);

  return (
    <div className="rounded shadow-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-500 p-1" style={{ height: "80px" }}>
      <div className="p-0">
        <div className="tradingview-widget-container" ref={widgetContainerRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>
    </div>
  );
};

export default TickerTape;