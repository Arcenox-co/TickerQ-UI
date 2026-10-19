'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog, SearchDialogClose, SearchDialogContent, SearchDialogFooter,
  SearchDialogHeader, SearchDialogIcon, SearchDialogInput, SearchDialogList, SearchDialogOverlay,
} from 'fumadocs-ui/components/dialog/search';
import type { SharedProps } from 'fumadocs-ui/contexts/search';
import { usePathname } from 'next/navigation';
import { docsVersionFromPath, docsVersions, type DocsVersion } from '@/lib/docs-versions';

export function VersionedSearchDialog(props: SharedProps) {
  const pathname = usePathname();
  const version = pathname === "/docs" || pathname.startsWith("/docs/") ? docsVersionFromPath(pathname) : "5.x";
  return <VersionSearch key={version} version={version} {...props} />;
}

function VersionSearch({ version, ...props }: SharedProps & { version: DocsVersion }) {
  const { search, setSearch, query } = useDocsSearch({ type: 'fetch', api: `/api/search?version=${version}` });
  return (
    <SearchDialog {...props} search={search} onSearchChange={setSearch} isLoading={query.isLoading}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput aria-label={`Search ${docsVersions[version].label}`} />
          <SearchDialogClose />
        </SearchDialogHeader>
        {query.error ? (
          <p role="alert" className="px-4 py-6 text-sm text-fd-muted-foreground">Search is unavailable. Please try again.</p>
        ) : <SearchDialogList items={query.data === 'empty' ? null : query.data} />}
        <SearchDialogFooter>
          <span className="text-xs text-fd-muted-foreground">Searching {docsVersions[version].label}</span>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
