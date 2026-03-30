"use client";

import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IconProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const iconClassnames = (props: IconProps) =>
  cn(
    {
      "size-4": props.size === "sm",
      "size-5": props.size === "md" || !props.size,
      "size-7": props.size === "lg",
    },
    props.className,
    "duration-200 ease-in-out",
  );

export const Icon = {
  User: (props: IconProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClassnames(props)}
    >
      <path
        d="M12.0273 14.4941C14.8295 14.4941 18.6122 15.0984 20.7275 17.9746H20.7256C22.0377 19.758 22.0527 21.573 22.0527 21.6494H21.002L19.9521 21.6582C19.9479 21.4511 19.7767 16.5967 12.0273 16.5967C8.76445 16.5967 6.36138 17.4737 5.08496 19.1348C4.13415 20.3688 4.10254 21.6455 4.10254 21.6582L2 21.6494C2 21.5709 2.01496 19.758 3.32715 17.9746C5.44253 15.0984 9.22515 14.4941 12.0273 14.4941ZM12.0215 1.65527C15.4682 1.65527 17.9707 4.02227 17.9707 7.28516C17.9706 10.548 15.4682 12.915 12.0215 12.915C8.58121 12.915 6.08309 10.5479 6.08301 7.28516C6.08301 4.02231 8.57481 1.65533 12.0215 1.65527ZM12.0215 3.75781C9.72654 3.75787 8.18555 5.17615 8.18555 7.28516C8.18563 9.39407 9.75619 10.8124 12.0215 10.8125C14.2868 10.8125 15.87 9.36241 15.8701 7.28516C15.8701 5.20781 14.2869 3.75781 12.0215 3.75781Z"
        fill="currentColor"
      />
    </svg>
  ),
  Car: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" fill="none" className={iconClassnames(props)}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.9766 3.65527C16.2858 3.65536 18.8418 4.59155 20.5703 6.43945C21.9947 7.95948 22.5263 9.76422 22.7217 11.041H25V13.2539H22.8262V21.8398H20.6133V18.498C20.6611 17.6208 20.9478 16.9493 21.8662 16.9492V16.0264L20.6133 16.0244L5.33887 16.0264H4.08398V16.9492C5.01311 16.9494 5.29544 17.6362 5.33887 18.5264V21.8398H3.12598V13.2539H1V11.041H3.23438C3.43633 9.7598 3.97964 7.94826 5.41504 6.42383C7.14793 4.58685 9.66725 3.65527 12.9766 3.65527ZM12.9766 5.86816C10.3251 5.86816 8.32278 6.56779 7.02637 7.94238C5.20982 9.86931 5.33353 12.4958 5.33887 12.543V13.8096H20.6133V12.5352C20.6155 12.5134 20.7437 9.84454 18.9395 7.93359C17.6453 6.56342 15.6278 5.86824 12.9766 5.86816Z"
        fill="currentColor"
      />
    </svg>
  ),
  LongArrowRight: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" fill="none" className={iconClassnames(props)}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9039 19.7252L19.3941 15.235L18.8902 14.7301L2.37262 14.7301L2.37262 12.3971L18.8736 12.3971L19.3961 11.8746L14.9039 7.38147L16.5523 5.73303L24.3726 13.5533C24.3726 13.5533 23.0428 14.8835 22.5572 15.3668L22.5601 15.3668L16.5523 21.3737L14.9039 19.7252Z"
        fill="currentColor"
      />
    </svg>
  ),
  LogOut: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={iconClassnames(props)}>
      <path
        d="M15.6709 16.2119L18.0215 13.8623L17.5176 13.3574L9.5 13.3574L9.5 11.0244L17.501 11.0244L18.0234 10.502L15.6709 8.14844L17.3193 6.5L23 12.1807C23 12.1807 21.6702 13.5109 21.1846 13.9941L21.1875 13.9941L17.3193 17.8613L15.6709 16.2119Z"
        fill="currentColor"
      />
      <path d="M12 6.8V4H2V20H12V17.6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Calendar: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className={iconClassnames(props)}>
      <path
        d="M14.1101 16.5781H6.11029C4.03689 16.5781 2.35156 15.1577 2.35156 13.4134V4.04443H4.01472V13.4134C4.01472 14.296 4.95717 15.0114 6.11029 15.0114H14.1101C15.2687 15.0114 16.2056 14.296 16.2056 13.4134V4.04443H17.8688V13.4134C17.8688 15.1577 16.1835 16.5781 14.1101 16.5781Z"
        fill="currentColor"
      />
      <path d="M6.78108 11.8937H5.11792V13.4291H6.78108V11.8937Z" fill="currentColor" />
      <path d="M9.55305 11.8937H7.88989V13.4291H9.55305V11.8937Z" fill="currentColor" />
      <path d="M12.3249 11.8937H10.6617V13.4291H12.3249V11.8937Z" fill="currentColor" />
      <path d="M15.0969 11.8937H13.4337V13.4291H15.0969V11.8937Z" fill="currentColor" />
      <path
        d="M12.8405 7.17791H7.37427C6.13244 7.17791 5.11792 6.23265 5.11792 5.06806V3H6.78108V5.06806C6.78108 5.36573 7.04718 5.61119 7.37427 5.61119H12.8405C13.1676 5.61119 13.4337 5.36573 13.4337 5.06806V3H15.0969V5.06806C15.0969 6.23265 14.0823 7.17791 12.8405 7.17791Z"
        fill="currentColor"
      />
      <path d="M6.78108 9.28259H5.11792V10.818H6.78108V9.28259Z" fill="currentColor" />
      <path d="M9.55305 9.28259H7.88989V10.818H9.55305V9.28259Z" fill="currentColor" />
      <path d="M12.3249 9.28259H10.6617V10.818H12.3249V9.28259Z" fill="currentColor" />
      <path d="M15.0969 9.28259H13.4337V10.818H15.0969V9.28259Z" fill="currentColor" />
    </svg>
  ),
};

export const IconComponent = ({
  icon,
  size = "md",
  className = "",
}: {
  icon: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const IconToRender = mapNameToIcon(icon);

  if (!IconToRender) {
    return null;
  }

  return <IconToRender size={size} className={className} />;
};

const mapNameToIcon = (name: string) => {
  const customIcon = Icon[name as keyof typeof Icon];
  if (customIcon) return customIcon;

  const lucideIcon = LucideIcons[name as keyof typeof LucideIcons];
  if (lucideIcon && typeof lucideIcon === "object" && "displayName" in lucideIcon) {
    return (props: IconProps) => {
      const LIcon = lucideIcon as unknown as LucideIcon;
      return <LIcon className={iconClassnames(props)} />;
    };
  }

  return null;
};

export default Icon;
