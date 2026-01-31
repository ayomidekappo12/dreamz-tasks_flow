import { Link as RouterNavLink, NavLinkProps } from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

Link.displayName = "Link";

export { NavLink };