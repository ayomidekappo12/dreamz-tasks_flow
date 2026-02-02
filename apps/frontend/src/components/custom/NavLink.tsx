"use client";

import NextLink, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LinkCompatProps extends LinkProps {
  className?: string;
  activeClassName?: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkCompatProps>(
  ({ href, className, activeClassName, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <NextLink
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

Link.displayName = "Link";

export { Link };