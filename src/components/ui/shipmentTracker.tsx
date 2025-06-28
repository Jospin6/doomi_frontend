'use client';
import { useState } from 'react';
import { ShipmentData, ShipmentStatus } from '@/types/shipping';

const statusSteps = [
  { id: 'PROCESSING', label: 'En préparation' },
  { id: 'PACKED', label: 'Emballé' },
  { id: 'SHIPPED', label: 'Expédié' },
  { id: 'IN_TRANSIT', label: 'En transit' },
  { id: 'DELIVERED', label: 'Livré' }
];

export function ShipmentTracker({ shipment }: { shipment: ShipmentData }) {
  const currentStepIndex = statusSteps.findIndex(step => step.id === shipment.status);
  
  return (
    <div className="px-4 py-6">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-3 left-4 h-full w-0.5 bg-gray-200">
          <div 
            className="bg-blue-600 h-full transition-all duration-500" 
            style={{ 
              height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` 
            }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {statusSteps.map((step, index) => (
            <div key={step.id} className="relative flex items-start">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {index + 1}
              </div>
              <div className="ml-4">
                <h3 className={`font-medium ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </h3>
                {index === currentStepIndex && shipment.status === 'SHIPPED' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Numéro de suivi: {shipment.trackingNumber}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}