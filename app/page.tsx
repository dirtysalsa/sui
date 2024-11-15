"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, TrendingUp, Clock, Wallet, Shield, Calendar, Filter } from 'lucide-react';

const Dashboard = () => {
  // Timeline range state
  const [timeRange, setTimeRange] = useState([0, 100]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('volume');

  // Extended historical data
  const historicalData = [
    { date: '2024-01-01', inflow: 2500000, outflow: 2100000, volume: 4600000, timestamp: 1704067200000 },
    { date: '2024-01-15', inflow: 2800000, outflow: 2300000, volume: 5100000, timestamp: 1705276800000 },
    { date: '2024-02-01', inflow: 3200000, outflow: 2800000, volume: 6000000, timestamp: 1706745600000 },
    { date: '2024-02-15', inflow: 3000000, outflow: 2700000, volume: 5700000, timestamp: 1707955200000 },
    { date: '2024-03-01', inflow: 2800000, outflow: 2600000, volume: 5400000, timestamp: 1709251200000 },
    { date: '2024-03-15', inflow: 3100000, outflow: 2800000, volume: 5900000, timestamp: 1710460800000 },
    { date: '2024-04-01', inflow: 3500000, outflow: 3100000, volume: 6600000, timestamp: 1711929600000 },
    { date: '2024-04-15', inflow: 3800000, outflow: 3300000, volume: 7100000, timestamp: 1713139200000 },
  ];

  const hourlyData = [
    { hour: '00:00', transactions: 145 },
    { hour: '04:00', transactions: 92 },
    { hour: '08:00', transactions: 287 },
    { hour: '12:00', transactions: 342 },
    { hour: '16:00', transactions: 408 },
    { hour: '20:00', transactions: 275 },
  ];

  const tokens = [
    { name: 'USDC', tvl: 12500000, percentage: 45, change: '+12.5%' },
    { name: 'USDT', tvl: 8200000, percentage: 30, change: '+8.2%' },
    { name: 'WETH', tvl: 4100000, percentage: 15, change: '-5.1%' },
    { name: 'WBTC', tvl: 2800000, percentage: 10, change: '+3.4%' },
  ];

  // Define metrics data
  const metrics = [
    {
      title: "24h Volume",
      value: "$7.9M",
      change: "+15.3%",
      icon: DollarSign,
      trend: "positive",
      description: "Total bridge volume in last 24 hours"
    },
    {
      title: "TVL",
      value: "$27.6M",
      change: "+8.2%",
      icon: Wallet,
      trend: "positive",
      description: "Total value locked across all chains"
    },
    {
      title: "Active Users",
      value: "1,248",
      change: "+12.5%",
      icon: Activity,
      trend: "positive",
      description: "Unique users in last 24 hours"
    },
    {
      title: "Avg Time",
      value: "2.3 min",
      change: "-18.5%",
      icon: Clock,
      trend: "positive",
      description: "Average transaction completion time"
    }
  ];

  // Timeline slider component
  const TimelineSlider = () => {
    const handleRangeChange = (e) => {
      try {
        setTimeRange([timeRange[0], parseInt(e.target.value)]);
      } catch (error) {
        console.error('Error updating timeline:', error);
      }
    };

    return (
        <div className="w-full px-4 py-2">
          <input
              type="range"
              min="0"
              max="100"
              value={timeRange[1]}
              onChange={handleRangeChange}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Jan 1, 2024</span>
            <span>Apr 15, 2024</span>
          </div>
        </div>
    );
  };

  // Filter data based on timeline range
  useEffect(() => {
    const startTimestamp = historicalData[0].timestamp;
    const endTimestamp = historicalData[historicalData.length - 1].timestamp;
    const rangeEnd = startTimestamp + (endTimestamp - startTimestamp) * (timeRange[1] / 100);

    const filtered = historicalData.filter(item =>
        item.timestamp <= rangeEnd
    );
    setFilteredData(filtered);
  }, [timeRange]);

  // Metric selector component
  const MetricSelector = () => {
    return (
        <div className="flex gap-2 mb-4">
          <button
              onClick={() => setSelectedMetric('volume')}
              className={`px-4 py-2 rounded-lg ${
                  selectedMetric === 'volume' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
          >
            Volume
          </button>
          <button
              onClick={() => setSelectedMetric('inflow')}
              className={`px-4 py-2 rounded-lg ${
                  selectedMetric === 'inflow' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
          >
            Inflow
          </button>
          <button
              onClick={() => setSelectedMetric('outflow')}
              className={`px-4 py-2 rounded-lg ${
                  selectedMetric === 'outflow' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
          >
            Outflow
          </button>
        </div>
    );
  };

  // Add error boundary wrapper
  const ChartWrapper = ({ children }) => {
    try {
      return children;
    } catch (error) {
      return (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Unable to load chart</p>
          </div>
      );
    }
  };

  // Modified CustomTooltip with better type checking
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && Array.isArray(payload) && payload.length > 0) {
      return (
          <div className="bg-white p-4 border rounded-lg shadow-lg">
            <p className="font-bold">{label}</p>
            {payload.map((entry, index) => (
                <p key={index} style={{ color: entry.color }}>
                  {entry.name}: ${(entry.value / 1000000).toFixed(2)}M
                </p>
            ))}
          </div>
      );
    }
    return null;
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Header section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Sui Bridge Analytics
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Real-time analytics for cross-chain bridge activity
              </p>
            </div>

            <Alert className="w-full lg:w-auto">
              <Shield className="h-4 w-4" />
              <AlertTitle>Bridge Status: Operational</AlertTitle>
              <AlertDescription>
                All systems functioning normally
              </AlertDescription>
            </Alert>
          </div>

          {/* Metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {metric.title}
                        </p>
                        <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
                        <p className={`text-sm mt-1 flex items-center gap-1 
                      ${metric.trend === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                          {metric.change}
                          {metric.trend === 'positive' ?
                              <TrendingUp className="h-4 w-4" /> :
                              <ArrowDownRight className="h-4 w-4" />
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
                      </div>
                      <div className={`p-4 rounded-full 
                    ${metric.trend === 'positive' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <metric.icon className={`w-6 h-6 
                      ${metric.trend === 'positive' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          {/* Main chart */}
          <ChartWrapper>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Bridge Activity Analysis</CardTitle>
                    <CardDescription>Historical trends with interactive timeline</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <Filter className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MetricSelector />
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData}>
                      <defs>
                        <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                          type="monotone"
                          dataKey={selectedMetric}
                          stroke="#6366F1"
                          fillOpacity={1}
                          fill="url(#colorInflow)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <TimelineSlider />
              </CardContent>
            </Card>
          </ChartWrapper>

          {/* Additional charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper>
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>24h Transaction Activity</CardTitle>
                  <CardDescription>Hourly transaction distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="transactions" fill="#6366F1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </ChartWrapper>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Token Distribution</CardTitle>
                <CardDescription>Total Value Locked by Token</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tokens.map((token) => (
                      <div key={token.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-lg">{token.name}</span>
                            <span className="ml-4 text-gray-500">${(token.tvl / 1000000).toFixed(1)}M</span>
                          </div>
                          <span className={token.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                        {token.change}
                      </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${token.percentage}%` }}
                          />
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;