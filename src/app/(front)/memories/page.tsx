'use client';

import { useEffect, useState } from 'react';
import { Memory } from '@/types';
import { getAllMemories } from '@/app/actions';
import Image from 'next/image';

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    getAllMemories()
      .then((res) => setMemories(res))
      .catch((err) => {
        console.error('Failed to fetch memories:', err);
        setMemories([]); // fallback to empty
      });
  }, []);

  const fallbackMemories: Memory[] = [
    {
      id: '1',
      title: 'Unforgettable Night',
      mediaUrl: '/memories/mem1.jpg',
      description: 'The best energy and vibes.',
      eventName: 'Greek Party Vol.1',
      createdAt: '2024-04-01',
    },
    {
      id: '2',
      title: 'Cheers and Dance',
      mediaUrl: '/memories/mem2.jpg',
      description: 'Everyone was dancing all night.',
      eventName: 'Summer Jam',
      createdAt: '2024-04-02',
    },
    {
      id: '3',
      title: 'Fireworks & Fun',
      mediaUrl: '/memories/mem3.mp4',
      description: 'A night full of magic and lights.',
      eventName: 'NYE Bash',
      createdAt: '2024-01-01',
    },
    {
      id: '4',
      title: 'Sing-Along Moments',
      mediaUrl: '/memories/mem4.jpg',
      description: 'Crowd singing together with joy.',
      eventName: 'Open Mic Night',
      createdAt: '2024-03-15',
    },
    {
      id: '5',
      title: 'Epic Finale',
      mediaUrl: '/memories/mem5.jpg',
      description: 'The perfect ending to a perfect night.',
      eventName: 'Greek Party Vol.2',
      createdAt: '2024-04-20',
    },
  ];

  const displayedMemories = memories.length > 0 ? memories : fallbackMemories;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-amber-300">Memories</h1>
      <p className="text-amber-50 mb-10 max-w-2xl">
        Take a walk down memory lane with our favorite moments from previous events.
        Photos, cheers, music, and unforgettable energy captured forever.
      </p>

      <div className="space-y-12">
        {displayedMemories.map((memory) => (
          <div key={memory.id} className="flex flex-col gap-4">
            <div className="w-full aspect-video bg-zinc-200 overflow-hidden rounded-xl shadow">
              {memory.mediaUrl.endsWith('.mp4') ? (
                <video
                  src={memory.mediaUrl}
                  controls
                  className="w-full h-full object-cover border-2 border-amber-200"
                />
              ) : (
                <Image
                  src={memory.mediaUrl}
                  alt={memory.title}
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover border-2  border-amber-200"
                />
              )}
            </div>
            <div>
              <h2 className="text-xl text-amber-200 font-semibold">{memory.title}</h2>
              <p className="text-amber-300 text-sm">{memory.eventName}</p>
              <p className="text-amber-100 mt-2">{memory.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
