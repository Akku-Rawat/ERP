import React from 'react';
import { ShieldCheck, Bell, AlertTriangle, FileText } from 'lucide-react';
import Card from './Card';
import { demoStats } from './data';

/**
 * Adjusted visuals:
 * - teal accent for score
 * - tighter spacing and smaller helper text similar to other screens
 * - clickable mini-actions are clearer
 */

const OverviewCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Compliance Score</div>
            <div className="text-2xl font-bold text-gray-900">{demoStats.compliancePct}%</div>
            <div className="text-xs text-gray-400">Overall organisational compliance</div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Upcoming Expiries</div>
            <div className="text-2xl font-bold text-gray-900">{demoStats.upcomingExpiries}</div>
            <div className="text-xs text-gray-400">Documents & certifications</div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Overdue Tasks</div>
            <div className="text-2xl font-bold text-gray-900">{demoStats.overdueTasks}</div>
            <div className="text-xs text-gray-400">Requires immediate action</div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Violations</div>
            <div className="text-2xl font-bold text-gray-900">{demoStats.violations}</div>
            <div className="text-xs text-gray-400">Logged breaches</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OverviewCards;
