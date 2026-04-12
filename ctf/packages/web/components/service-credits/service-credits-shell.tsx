import { ServiceCredits } from '@/components/mockups/survivor-hub/ServiceCredits';

type ServiceCreditsShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function ServiceCreditsShell(props: ServiceCreditsShellProps) {
  void props;
  return <ServiceCredits />;
}
