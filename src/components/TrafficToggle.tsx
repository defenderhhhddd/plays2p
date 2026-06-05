import { useState, useEffect } from "react";

interface TrafficToggleProps {
  traderId: number;
  onToggle?: (enabled: boolean) => void;
}

export function TrafficToggle({ traderId, onToggle }: TrafficToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/traders/${traderId}/traffic-status`)
      .then(res => res.json())
      .then(data => setEnabled(data.enabled))
      .catch(() => {});
  }, [traderId]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/traders/${traderId}/traffic-toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });
      if (res.ok) {
        setEnabled(!enabled);
        onToggle?.(!enabled);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
        enabled ? "bg-[#D4AF37]" : "bg-gray-700"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
          enabled ? "right-1" : "left-1"
        }`}
      />
    </button>
  );
}
