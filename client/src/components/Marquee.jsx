import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLiveMetalRates } from '../services/metalRatesAPI';
import { useEffect } from 'react';

function Marquee() {
    const queryClient = useQueryClient();

    // Fetch live market rates with smart scheduling
    const { data: liveRates, isLoading } = useQuery({
        queryKey: ['liveMetalRates'],
        queryFn: fetchLiveMetalRates,
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute
        cacheTime: 0, // Don't cache in React Query - let our API handle caching
        retry: 1, // Only retry once to prevent excessive calls
    });

    // Debug: Log current rates for troubleshooting
    useEffect(() => {
        if (liveRates?.data) {
            console.log('📊 Marquee rates:', {
                gold: liveRates.data.goldRate,
                silver: liveRates.data.silverRate,
                source: liveRates.data.source,
                timestamp: liveRates.data.timestamp
            });
        }
    }, [liveRates?.data]);

    const formatRate = (rate) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(rate);
    };

    const getSourceIcon = (source) => {
        if (source?.includes('Delhi Market')) return '🏪';
        if (source?.includes('Enhanced')) return '🔄';
        if (source?.includes('API')) return '🌐';
        if (source?.includes('Cached')) return '🟡';
        if (source?.includes('Simulated') || source?.includes('Fallback')) return '⚡';
        return '�';
    };

    if (isLoading) {
        return (
            <div className="bg-black text-white py-2 overflow-hidden">
                <marquee>
                    Loading live gold and silver rates...
                </marquee>
            </div>
        );
    }

    const rates = liveRates?.data;
    const source = rates?.source || 'Unknown';
    const sourceIcon = getSourceIcon(source);

    return (
        <div className="bg-black text-white py-2 overflow-hidden">
            <marquee>
                {sourceIcon} Delhi Market Rates: Gold ₹{formatRate((rates?.goldRate || 0) * 10)}/10g (₹{formatRate(rates?.goldRate || 0)}/g) • Silver ₹{formatRate(rates?.silverRate || 0)}/gram • Source: {source} • Updated: {rates?.timestamp ? new Date(rates.timestamp).toLocaleTimeString() : 'N/A'}
            </marquee>
        </div>
    );
}

export default Marquee;