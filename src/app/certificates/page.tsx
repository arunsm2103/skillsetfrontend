'use client';

import React from 'react';
import Image from 'next/image';

interface Certificate {
  id: number;
  title: string;
  image: string;
}

export default function CertificatesPage() {
  const certificates: Certificate[] = [
    {
      id: 1,
      title: 'Expert Certificate Details',
      image: '/images/certificates/achiever.png'
    },
    {
      id: 2,
      title: 'Achiever Certificate Details',
      image: '/images/certificates/expert.png'
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-8">My Certificates</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((cert) => (
          <div 
            key={cert.id} 
            className="flex flex-col items-center"
          >
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center mb-4 hover:shadow-lg transition-shadow">
              <div className="relative w-48 h-48">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg cursor-pointer hover:text-blue-600">
                {cert.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 