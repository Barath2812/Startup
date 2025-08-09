import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { axios, toast } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    salesByCategory: {},
    salesByMonth: {},
    salesByCity: {},
    topProducts: [],
    recentOrders: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/analytics/seller', { withCredentials: true });
      
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        toast.error(data.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Analytics and insights for your e-commerce business</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{analytics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{analytics.averageOrderValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales by Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
            <div className="space-y-3">
              {Object.entries(analytics.salesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">{category}</span>
                  <span className="text-green-600 font-semibold">₹{amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales by City */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by City</h3>
            <div className="space-y-3">
              {Object.entries(analytics.salesByCity).map(([city, amount]) => (
                <div key={city} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">{city}</span>
                  <span className="text-blue-600 font-semibold">₹{amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">#{index + 1}</span>
                    <img src={product.image[0]} alt={product.name} className="w-10 h-10 rounded object-cover mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{product.totalSales}</p>
                    <p className="text-sm text-gray-500">{product.quantitySold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {analytics.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Sales Summary */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(analytics.salesByMonth).map(([month, amount]) => (
              <div key={month} className="text-center p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium text-gray-600">{month}</p>
                <p className="text-lg font-bold text-gray-900">₹{amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 