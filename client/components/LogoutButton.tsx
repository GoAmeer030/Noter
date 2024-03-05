import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ButtonWithSpinner from '@/components/updatedui/ButtonWithSpinner';

import { useToast } from '@/components/ui/use-toast';
import { LogoutIcon } from '@/components/icons/LogoutIcon';

import { useTopicStore } from '@/stores/topicStore';
import { useParamStore } from '@/stores/paramStore';
import { useRoleIdStore } from '@/stores/roleIdStore';
import { useStaffStore } from '@/stores/usersStore/staffStore';
import { useStudentStore } from '@/stores/usersStore/studentStore';
import { useAccessTokenStore } from '@/stores/tokenStore/accessTokenStore';

export default function LogoutButton() {
  const router = useRouter();
  const { toast } = useToast();

  const { resetStaff } = useStaffStore();
  const { resetRoleId } = useRoleIdStore();
  const { resetStudent } = useStudentStore();
  const { setAccessToken } = useAccessTokenStore();
  const { resetTopic: resetFile } = useTopicStore();
  const setFiles = useParamStore((state) => state.setTopics);
  const setSearchFiles = useParamStore((state) => state.setSearchTopics);
  const setSearchResultTrigger = useParamStore(
    (state) => state.setSearchTopicResultTrigger,
  );

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setAccessToken('');
    localStorage.removeItem('accessToken');

    resetFile();
    resetStaff();
    resetStudent();
    resetRoleId();
    setSearchResultTrigger(false);
    setFiles([]);
    setSearchFiles([]);

    setLoggingOut(false);

    router.push('/auth/signin');

    toast({
      title: 'Logged Out',
      description: 'You have been logged out',
    });

    return;
  };

  return (
    // <ButtonWithSpinner
    //   mutation={{ isPending: loggingOut }}
    //   innerContent={
    //     <>
    //       <span className="text-lg mr-2">
    //         <LogoutIcon />
    //       </span>
    //       Logout
    //     </>
    //   }
    //   innerContentOnLoading={'Logging Out'}
    //   props={{
    //     onClick: () => {
    //       handleLogout();
    //       setLoggingOut(true);
    //     },
    //     className: 'w-full',
    //   }}
    // />
    <p className="flex" onClick={handleLogout}>
      <span className="text-lg mr-2">
        <LogoutIcon />
      </span>
      Logout
    </p>
  );
}
