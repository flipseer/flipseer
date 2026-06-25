import { redirect } from 'next/navigation';

type Props = { params: { code: string } };

export default function JoinRedirect({ params }: Props) {
  const code = params.code?.toUpperCase() || '';
  redirect(`/groups?join=${code}`);
}
