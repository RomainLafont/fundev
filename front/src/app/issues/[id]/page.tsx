'use client';

import React from 'react';

const Page = ({ params }: { params: { id: string } }) => {

  return (
    <div>
      <h1>Issue {params.id}</h1>
    </div>
  );
};

export default Page;