'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';

import {
  ClubExcelActions,
  ClubFilter,
  ClubFormDialog,
  ClubList,
  ClubPagination,
} from '@/widgets/clubs';

// Demo data
const demoClubs = [
  { id: 1, name: 'GSM', type: '전공' },
  { id: 2, name: 'IoT Lab', type: '전공' },
  { id: 3, name: 'AI Research', type: '전공' },
  { id: 4, name: '취창업동아리', type: '취업' },
  { id: 5, name: '스타트업', type: '취업' },
  { id: 6, name: '면접준비', type: '취업' },
  { id: 7, name: '게임개발', type: '자율' },
  { id: 8, name: '독서', type: '자율' },
  { id: 9, name: '운동', type: '자율' },
];

const ClubsPage = () => {
  const [clubs] = useState(demoClubs);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredClubs = clubs.filter((club) => {
    if (typeFilter !== 'all' && club.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="bg-background h-[calc(100vh-4.0625rem)]">
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">동아리 관리</CardTitle>
              <div className="flex items-center gap-2">
                <ClubExcelActions />
                <ClubFormDialog />
              </div>
            </div>

            <ClubFilter typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} />
          </CardHeader>
          <CardContent>
            <ClubList clubs={filteredClubs} />
            <ClubPagination currentPage={currentPage} onPageChange={setCurrentPage} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClubsPage;
