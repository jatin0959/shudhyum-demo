import React from 'react';
import { CheckCircle, AlertCircle, Cloud, HardDrive } from 'lucide-react';
import { dbConfig } from '../config/database';

export function SystemStatus() {
  const connectionInfo = dbConfig.getConnectionInfo();
  const isOnline = connectionInfo.connected;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`px-3 py-2 rounded-lg shadow-lg text-xs ${
        isOnline 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-blue-50 border border-blue-200 text-blue-800'
      }`}>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <>
              <Cloud className="h-3 w-3" />
              <span>Online</span>
            </>
          ) : (
            <>
              <HardDrive className="h-3 w-3" />
              <span>Offline</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}