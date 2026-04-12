import * as React from 'react';

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>;

export function ScrollArea({ className = '', style, ...props }: ScrollAreaProps) {
  return <div className={className} style={{ overflow: 'auto', ...style }} {...props} />;
}
