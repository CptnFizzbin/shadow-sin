import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import Footer from '../components/Footer';
import Header from '../components/Header';

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider';

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

import type { QueryClient } from '@tanstack/react-query';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

function RootLayout () {
  return (
    <TanStackQueryProvider>
      <Header />
      <Outlet />
      <Footer />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </TanStackQueryProvider>
  );
}


