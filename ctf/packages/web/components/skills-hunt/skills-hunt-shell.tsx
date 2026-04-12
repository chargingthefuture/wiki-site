import { SkillsHunt } from '@/components/mockups/survivor-hub/SkillsHunt';

type SkillsHuntShellProps = {
  userId: string;
  isAdmin: boolean;
  isModerator: boolean;
};

export async function SkillsHuntShell(props: SkillsHuntShellProps) {
  void props;
  return <SkillsHunt />;
}
