export interface DocsSectionItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  children?: DocsSectionItem[];
}

export interface DocsSection extends DocsSectionItem {
  icon: React.ElementType;
}
