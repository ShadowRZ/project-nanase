import { ParentComponent } from 'solid-js';
import ClientLayout from './ClientLayout';
import ClientRoot from './ClientRoot';
import { MobileFriendlyPage, MobileFriendlySidebar } from './MobileFriendly';
import Sidebar from './sidebar/Sidebar';

export const ClientRoute: ParentComponent = (props) => {
  return (
    <ClientRoot>
      <ClientLayout
        nav={
          <MobileFriendlySidebar>
            <Sidebar />
          </MobileFriendlySidebar>
        }
      >
        <MobileFriendlyPage>{props.children}</MobileFriendlyPage>
      </ClientLayout>
    </ClientRoot>
  );
};
