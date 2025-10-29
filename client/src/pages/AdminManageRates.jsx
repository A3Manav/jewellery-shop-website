import { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Coins, TrendingUp, DollarSign, Save, RefreshCw, Wifi, WifiOff, Clock, AlertCircle } from 'lucide-react';
import { fetchLiveMetalRates, formatIndianRate, getCachedRates, cacheRates } from '../services/metalRatesAPI';

function AdminManageRates() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: rate, isLoading, error } = useQuery({
        queryKey: ['rate'],
        queryFn: () => axios.get('/api/rates').then(res => res.data),
        enabled: !!user,
    });

    const [formData, setFormData] = useState({
        goldRate: '',
        silverRate: '',
    });

    const [liveRates, setLiveRates] = useState(null);
    const [isLoadingLiveRates, setIsLoadingLiveRates] = useState(false);
    const [liveRateError, setLiveRateError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        if (rate) {
            setFormData({
                goldRate: rate.goldRate || '',
                silverRate: rate.silverRate || '',
            });
        }
    }, [rate]);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    // Load cached rates on component mount
    useEffect(() => {
        const cached = getCachedRates();
        if (cached) {
            setLiveRates(cached);
            setLastUpdated(new Date(cached.timestamp));
        }
        // Auto-fetch live rates every 5 minutes
        const interval = setInterval(fetchLiveRates, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Function to fetch live rates
    const fetchLiveRates = async () => {
        setIsLoadingLiveRates(true);
        setLiveRateError(null);

        try {
            const response = await fetchLiveMetalRates();

            if (response.success) {
                setLiveRates(response.data);
                setLastUpdated(new Date(response.data.timestamp));
                cacheRates(response.data);

                if (response.data.source === 'Fallback (Simulated)') {
                    toast.error('Live rates unavailable. Showing simulated data.');
                } else {
                    toast.success(`Live rates updated from ${response.data.source}`);
                }
            } else {
                setLiveRates(response.data);
                setLiveRateError(response.error);
                toast.warning('Using fallback rates. Check API configuration.');
            }
        } catch (error) {
            setLiveRateError('Failed to fetch live rates');
            toast.error('Failed to fetch live rates');
            console.error('Live rates error:', error);
        } finally {
            setIsLoadingLiveRates(false);
        }
    };

    // Function to apply live rates to form
    const applyLiveRates = () => {
        if (liveRates) {
            setFormData({
                goldRate: liveRates.goldRate.toString(),
                silverRate: liveRates.silverRate.toString(),
            });
            toast.success('Live rates applied to form');
        }
    };

    const updateRate = useMutation({
        mutationFn: data =>
            axios.post(
                '/api/rates',
                { goldRate: parseFloat(data.goldRate), silverRate: parseFloat(data.silverRate) },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rate'] });
            toast.success('Rates updated successfully');
        },
        onError: () => toast.error('Failed to update rates'),
    });

    const handleSubmit = e => {
        e.preventDefault();
        updateRate.mutate(formData);
    };

    if (!user || isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading rates: {error.message}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <TrendingUp className="w-8 h-8 text-amber-500 mr-3" />
                                    Manage Metal Rates
                                </h1>
                                <p className="text-gray-600 mt-1">Update current gold and silver market rates</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={fetchLiveRates}
                                disabled={isLoadingLiveRates}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                            >
                                {isLoadingLiveRates ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Fetching...
                                    </>
                                ) : (
                                    <>
                                        <Wifi className="w-4 h-4 mr-2" />
                                        Get Live Rates
                                    </>
                                )}
                            </button>
                            <div className="text-sm text-gray-500 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>Last updated: {new Date().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Rates Section */}
                {liveRates && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Wifi className="w-6 h-6 text-green-500 mr-2" />
                                Live Market Rates
                            </h2>
                            <div className="flex items-center space-x-3">
                                {lastUpdated && (
                                    <div className="text-sm text-gray-500 flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {lastUpdated.toLocaleTimeString()}
                                    </div>
                                )}
                                <button
                                    onClick={fetchLiveRates}
                                    disabled={isLoadingLiveRates}
                                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingLiveRates ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Live Gold Rate</h3>
                                        <p className="text-2xl font-bold">₹{liveRates.goldRate?.toFixed(2)}</p>
                                        <p className="text-yellow-100 text-sm">per gram</p>
                                    </div>
                                    <Coins className="w-12 h-12 opacity-80" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Live Silver Rate</h3>
                                        <p className="text-2xl font-bold">₹{liveRates.silverRate?.toFixed(2)}</p>
                                        <p className="text-gray-100 text-sm">per gram</p>
                                    </div>
                                    <Coins className="w-12 h-12 opacity-80" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Source:</span> {liveRates.source}
                                </div>
                                {liveRateError && (
                                    <div className="flex items-center text-amber-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {liveRateError}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={applyLiveRates}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Apply Live Rates
                            </button>
                        </div>
                    </div>
                )}

                {/* Current Database Rates Display */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center mb-2">
                                    <Coins className="w-6 h-6 mr-2" />
                                    <h3 className="text-lg font-semibold">Current Gold Rate</h3>
                                </div>
                                <p className="text-3xl font-bold">₹{rate?.goldRate || '0'}</p>
                                <p className="text-indigo-100 text-sm">per gram (in database)</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-4">
                                <DollarSign className="w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-slate-500 to-gray-700 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center mb-2">
                                    <Coins className="w-6 h-6 mr-2" />
                                    <h3 className="text-lg font-semibold">Current Silver Rate</h3>
                                </div>
                                <p className="text-3xl font-bold">₹{rate?.silverRate || '0'}</p>
                                <p className="text-slate-100 text-sm">per gram (in database)</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-4">
                                <DollarSign className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Rates</h2>
                            <p className="text-gray-600">Enter the new market rates for gold and silver</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                                        <Coins className="w-4 h-4 text-amber-500 mr-2" />
                                        Gold Rate (₹/gram)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter gold rate"
                                            value={formData.goldRate}
                                            onChange={e => setFormData({ ...formData, goldRate: e.target.value })}
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:bg-white focus:outline-none transition-all duration-300 text-lg font-semibold"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                                            ₹/g
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                                        <Coins className="w-4 h-4 text-gray-500 mr-2" />
                                        Silver Rate (₹/gram)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter silver rate"
                                            value={formData.silverRate}
                                            onChange={e => setFormData({ ...formData, silverRate: e.target.value })}
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:bg-white focus:outline-none transition-all duration-300 text-lg font-semibold"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                                            ₹/g
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-6">
                                <button
                                    type="submit"
                                    disabled={updateRate.isPending}
                                    className="flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {updateRate.isPending ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Update Rates
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminManageRates;