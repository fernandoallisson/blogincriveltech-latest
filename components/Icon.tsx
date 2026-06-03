'use client';

import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bold,
  Bookmark,
  Megaphone,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Edit3,
  Eye,
  FileText,
  Folder,
  Grid3X3,
  Heart,
  Home,
  Image as ImageIcon,
  Inbox,
  Italic,
  Link as LinkIcon,
  List,
  Lock,
  Menu,
  Moon,
  Play,
  Plus,
  Quote,
  Rocket,
  Search,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Sun,
  Tag,
  Trash2,
  Upload,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  arrow: ArrowRight,
  bell: Bell,
  bold: Bold,
  bookmark: Bookmark,
  chart: BarChart3,
  check: Check,
  chevdown: ChevronDown,
  chevleft: ChevronLeft,
  chevright: ChevronRight,
  code: Code,
  edit: Edit3,
  eye: Eye,
  file: FileText,
  folder: Folder,
  grid: Grid3X3,
  heart: Heart,
  home: Home,
  image: ImageIcon,
  inbox: Inbox,
  italic: Italic,
  link: LinkIcon,
  list: List,
  lock: Lock,
  menu: Menu,
  megaphone: Megaphone,
  moon: Moon,
  play: Play,
  plus: Plus,
  quote: Quote,
  rocket: Rocket,
  search: Search,
  settings: Settings,
  share: Share2,
  shield: Shield,
  sparkle: Sparkles,
  sun: Sun,
  tag: Tag,
  trash: Trash2,
  upload: Upload,
  user: User,
  x: X,
};

interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  color?: string;
  className?: string;
}

export default function Icon({ name, size = 16, stroke = 1.8, color = 'currentColor', className }: IconProps) {
  const Lucide = icons[name];
  if (!Lucide) return null;
  return <Lucide className={className} size={size} strokeWidth={stroke} color={color} aria-hidden="true" />;
}
