import * as React from 'react';

type AvatarProps = React.HTMLAttributes<HTMLDivElement>;
type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;

export function Avatar({ className = '', ...props }: AvatarProps) {
  return <div className={className} {...props} />;
}

export function AvatarFallback({ className = '', ...props }: AvatarFallbackProps) {
  return <div className={className} {...props} />;
}
