'use client'

import React from 'react'
import { PageCompte } from '@/components/compte'
import { RequireRole } from '@/components/auth/RequireRole'

export default function ComptePage(): React.JSX.Element {
  return (
    <RequireRole role="user">
      <PageCompte />
    </RequireRole>
  )
}
