/**
 * src/components/ui/index.js
 * Barrel export — importer depuis '@/components/ui'
 *
 * Exemples :
 *   import { Button, Modal, useToast } from '@/components/ui';
 *   import Button from '@/components/ui/Button';
 */

export { default as Button } from './Button';
export { default as Avatar, AvatarGroup } from './Avatar';
export { default as Skeleton, SkeletonText, SkeletonCard, SkeletonCourseCard } from './Skeleton';
export { ToastProvider, useToast } from './Toast';
export { default as Modal } from './Modal';
export { Tabs, TabPanel } from './Tabs';
export { default as Dropdown } from './Dropdown';
export { default as VideoPlayer } from './VideoPlayer';

export { default as Badge } from './Badge';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as ProgressBar } from './ProgressBar';
export { default as SectionHeading } from './SectionHeading';
