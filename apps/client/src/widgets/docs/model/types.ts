export interface DocsSection {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: {
    label: string;
    href: string;
    children?: {
      label: string;
      href: string;
    }[];
  }[];
}
