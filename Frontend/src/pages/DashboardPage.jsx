import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from "recharts";
import { Users, TrendingUp, Clock, Award, Activity, Briefcase, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { candidateAPI } from "@/services/api";

const DashboardPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartsEnabled, setChartsEnabled] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await candidateAPI.getAnalytics();
        setAnalyticsData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load analytics data:", error);
        setError('Failed to load analytics data.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  
  useEffect(() => {
    try {
      if (typeof PieChart === 'undefined' || typeof BarChart === 'undefined') {
        setChartsEnabled(false);
      }
    } catch (error) {
      console.error("Charts library not available:", error);
      setChartsEnabled(false);
    }
  }, []);

  
  const COLORS = {
    Applied: '#3b82f6',    
    Interview: '#f59e0b',  
    Offer: '#10b981',      
    Rejected: '#ef4444'    
  };

  const EXPERIENCE_COLORS = [
    '#6366f1',  
    '#f59e0b',  
    '#10b981'   
  ];

  
  const prepareStatusData = () => {
    if (!analyticsData || !analyticsData.statusDistribution) return [];
    
    console.log('Raw statusDistribution:', analyticsData.statusDistribution);
    
    const statusData = analyticsData.statusDistribution.map(item => {
      const statusName = (item._id || item.status || 'Unknown').charAt(0).toUpperCase() + 
                       (item._id || item.status || 'Unknown').slice(1);
      
      return {
        name: statusName,
        value: item.count || 0,
        avgExperience: item.avgExperience || 0,
        percentage: analyticsData.totalCandidates ? 
                   ((item.count / analyticsData.totalCandidates) * 100).toFixed(1) : '0'
      };
    });
    
    console.log('Processed statusData:', statusData);
    return statusData;
  };

  const prepareRoleData = () => {
    if (!analyticsData || !analyticsData.roleDistribution) {
      console.log('No roleDistribution data available');
      return [];
    }
    
    console.log('Raw role distribution data:', analyticsData.roleDistribution);
    
    const roleData = analyticsData.roleDistribution.map(item => ({
      role: item._id || 'Unknown Role',
      candidates: item.count || 0
    }));
    
    console.log('Processed roleData:', roleData);
    return roleData;
  };

  
  
  


  
 
const generateExperienceData = () => {
  if (!analyticsData || !analyticsData.roleDistribution) {
    console.log('No role distribution data available');
    return [];
  }
  
  console.log('Raw roleDistribution for experience:', JSON.stringify(analyticsData.roleDistribution, null, 2));
  
  return analyticsData.roleDistribution.slice(0, 5).map(item => {
    console.log('Processing role item:', JSON.stringify(item, null, 2));
    
    
    let experienceRanges = {
      '0-2 years': 0,
      '3-5 years': 0,
      '6+ years': 0
    };
    
    
    if (item.experienceDistribution && Array.isArray(item.experienceDistribution)) {
      item.experienceDistribution.forEach(exp => {
        const expKey = exp._id?.toString() || '';
        const count = parseInt(exp.count) || 0;
        
        if (expKey.includes('0-2')) experienceRanges['0-2 years'] += count;
        else if (expKey.includes('3-5')) experienceRanges['3-5 years'] += count;
        else if (expKey.includes('6+')) experienceRanges['6+ years'] += count;
      });
    }
    
    
    if (item.experience && typeof item.experience === 'object') {
      Object.entries(item.experience).forEach(([key, value]) => {
        const count = parseInt(value) || 0;
        if (key.includes('0-2')) experienceRanges['0-2 years'] += count;
        else if (key.includes('3-5')) experienceRanges['3-5 years'] += count;
        else if (key.includes('6+')) experienceRanges['6+ years'] += count;
      });
    }
    
    
    if (item.countByExperience && typeof item.countByExperience === 'object') {
      Object.entries(item.countByExperience).forEach(([key, value]) => {
        const count = parseInt(value) || 0;
        if (key.includes('0-2')) experienceRanges['0-2 years'] += count;
        else if (key.includes('3-5')) experienceRanges['3-5 years'] += count;
        else if (key.includes('6+')) experienceRanges['6+ years'] += count;
      });
    }
    
    
    const totalExperience = Object.values(experienceRanges).reduce((sum, val) => sum + val, 0);
    if (totalExperience === 0 && item.count > 0) {
      console.log(`Distributing ${item.count} candidates for role:`, item._id);
      const count = item.count;
      if (count <= 3) {
        
        const perRange = Math.max(1, Math.floor(count / 3));
        const remainder = count % 3;
        experienceRanges = {
          '0-2 years': perRange + (remainder > 0 ? 1 : 0),
          '3-5 years': perRange + (remainder > 1 ? 1 : 0),
          '6+ years': perRange
        };
      } else {
        
        experienceRanges = {
          '0-2 years': Math.max(1, Math.floor(count * 0.4)),
          '3-5 years': Math.max(1, Math.floor(count * 0.4)),
          '6+ years': Math.max(1, count - Math.floor(count * 0.4) * 2)
        };
      }
      
      
      const total = Object.values(experienceRanges).reduce((sum, val) => sum + val, 0);
      if (total !== count) {
        experienceRanges['6+ years'] += count - total;
      }
    }
    
    return {
      role: item._id || 'Unknown Role',
      ...experienceRanges
    };
  });
};

  const statusData = prepareStatusData();
  const roleData = prepareRoleData();
  const experienceData = generateExperienceData();

  
  console.log('chartsEnabled:', chartsEnabled);
  console.log('statusData:', statusData);
  console.log('roleData:', roleData);
  console.log('experienceData:', experienceData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} candidates ({payload[0].payload?.percentage}%)
          </p>
          {payload[0].payload?.avgExperience && (
            <p className="text-sm text-gray-600">
              Avg Experience: {payload[0].payload.avgExperience} years
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  
  const SimpleChart = ({ title, data }) => (
    <div className="bg-gray-50 rounded-lg p-4 h-80 flex flex-col">
      <h4 className="font-medium text-gray-700 mb-4">{title}</h4>
      <div className="flex-1 flex items-end space-x-2">
        {data.slice(0, 6).map((item, index) => {
          const value = item.value || item.candidates || item["0-2 years"] || 0;
          const maxValue = Math.max(...data.map(d => d.value || d.candidates || d["0-2 years"] || 0));
          const height = maxValue > 0 ? (value / maxValue) * 200 : 20;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${height}px`, minHeight: '20px' }}
                title={`${item.name || item.role}: ${value}`}
              />
              <p className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                {item.name || item.role || `Item ${index + 1}`}
              </p>
              <p className="text-xs font-medium text-gray-800">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  
  const chartContainerStyle = {
    width: '100%',
    height: '400px',
    minHeight: '400px',
    border: '2px dashed #e5e7eb',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1rem 0',
    position: 'relative',
    overflow: 'hidden'
  };
  
  
  const ChartDebugInfo = ({ data, title }) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="font-medium text-red-700">No data available for {title}</p>
          <p className="text-sm text-red-600 mt-1">Data length: {data?.length || 0}</p>
          <pre className="text-xs text-red-500 mt-2 overflow-auto max-h-40">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
    }
    return null;
  };

  
  useEffect(() => {
    if (statusData && statusData.length > 0) {
      console.log('Status Data:', statusData);
    }
    if (roleData && roleData.length > 0) {
      console.log('Role Data:', roleData);
    }
    if (experienceData && experienceData.length > 0) {
      console.log('Experience Data:', experienceData);
    }
  }, [statusData, roleData, experienceData]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Insights and metrics for your recruitment pipeline</p>
        {!chartsEnabled && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ Chart library not available. Showing simplified visualizations.
            </p>
          </div>
        )}
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mt-8 -mr-8"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium opacity-90">Total Candidates</p>
              <p className="text-3xl font-bold">{analyticsData?.totalCandidates || 0}</p>
            </div>
            <Users className="h-8 w-8 opacity-90" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mt-8 -mr-8"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium opacity-90">Active Interviews</p>
              <p className="text-3xl font-bold">
                {statusData.find(s => s.name === "Interview")?.value || 0}
              </p>
            </div>
            <Clock className="h-8 w-8 opacity-90" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mt-8 -mr-8"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium opacity-90">Offers Extended</p>
              <p className="text-3xl font-bold">
                {statusData.find(s => s.name === "Offer")?.value || 0}
              </p>
            </div>
            <Award className="h-8 w-8 opacity-90" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mt-8 -mr-8"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium opacity-90">Avg Experience</p>
              <p className="text-3xl font-bold">{analyticsData?.avgExperience || 0}y</p>
            </div>
            <Briefcase className="h-8 w-8 opacity-90" />
          </div>
        </Card>
      </div>

      {}
      <Card className="p-6 overflow-hidden shadow-lg border border-gray-100 flex flex-col items-center justify-center h-64">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-semibold text-gray-800">Recent Activity</span>
        </div>
        <span className="text-4xl font-bold text-blue-600 mb-2">{analyticsData?.recentActivity || 0}</span>
        <span className="text-gray-600">new candidates added in the last 30 days</span>
      </Card>

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {}
        <Card className="p-6 overflow-hidden shadow-lg border border-gray-100">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Candidates by Stage
          </h3>
          <div style={chartContainerStyle}>
            <ChartDebugInfo data={statusData} title="Status Distribution" />
            {chartsEnabled && statusData && statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <SimpleChart title="Candidates by Stage" data={statusData} />
            )}
          </div>
        </Card>

        {}
        <Card className="p-6 overflow-hidden shadow-lg border border-gray-100">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Candidates by Role
          </h3>
          <div style={chartContainerStyle}>
            <ChartDebugInfo data={roleData} title="Role Distribution" />
            {chartsEnabled && roleData && roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="role" 
                    stroke="#6b7280"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#374151'
                    }}
                  />
                  <Bar 
                    dataKey="candidates" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Candidates"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <SimpleChart title="Candidates by Role" data={roleData} />
            )}
          </div>
        </Card>
      </div>

      {}
      <Card className="p-6 overflow-hidden shadow-lg border border-gray-100">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Experience Distribution by Role
        </h3>
        <div style={chartContainerStyle}>
          <ChartDebugInfo data={experienceData} title="Experience Distribution" />
          {chartsEnabled && experienceData && experienceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={experienceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="role" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [`${value} candidates`, name]}
                />
                <Legend />
                <Bar dataKey="0-2 years" stackId="a" fill="#8884d8" name="Junior (0-2 years)" />
                <Bar dataKey="3-5 years" stackId="a" fill="#82ca9d" name="Mid-level (3-5 years)" />
                <Bar dataKey="6+ years" stackId="a" fill="#ffc658" name="Senior (6+ years)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <SimpleChart title="Experience Distribution" data={experienceData} />
          )}
        </div>
      </Card>

      {}
      <Card className="p-6 overflow-hidden shadow-lg border border-gray-100">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Pipeline Summary
        </h3>
        <div className="space-y-4">
          {statusData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: COLORS[item.name] }}
                />
                <span className="font-medium text-gray-800">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-3 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 ease-out"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: COLORS[item.name]
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-20 text-right font-medium">
                  {item.value} ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
