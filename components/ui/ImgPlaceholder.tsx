'use client';

import React from 'react';
import Icon from '../Icon';

export default function ImgPlaceholder({ h = 160, w = '100%', label = 'imagem' }: { h?: number; w?: number | string; label?: string; tone?: string; radius?: string }) {
  return (
    <div className="grid shrink-0 place-items-center rounded-md border border-dashed border-border-strong bg-surface-2 text-xs text-subtle" style={{ height: h, width: w }}>
      <div className="flex items-center gap-2"><Icon name="image" size={16} />{label}</div>
    </div>
  );
}
