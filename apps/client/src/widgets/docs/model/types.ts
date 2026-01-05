export interface DocsSectionItem {
  label: string;
  href: string;
  children?: DocsSectionItem[];
}

export interface DocsSection extends DocsSectionItem {
  icon: React.ElementType;
}
