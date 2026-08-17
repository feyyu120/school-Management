import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { profileApi } from '../../services/profileApi';
import type { UserProfile } from '../../types/user';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { UserCircle } from 'lucide-react';

const ProfileField: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="py-3 border-b border-neutral-900 last:border-0">
    <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
    <p className="text-sm text-white">{value || '—'}</p>
  </div>
);

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileApi.getProfile().then(res => {
      if (res.success && res.data) setProfile(res.data);
    }).catch(err => {
      setError(err.message || 'Failed to load profile.');
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-lg">
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Your account information</p>
        </div>

        <ErrorMessage message={error} />

        {isLoading ? (
          <Loading />
        ) : profile ? (
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg">
            <div className="flex items-center space-x-4 p-5 border-b border-neutral-800">
              <div className="w-12 h-12 rounded-full bg-[#1b2d53] flex items-center justify-center shrink-0">
                <UserCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">{profile.full_name}</p>
                <p className="text-neutral-400 text-xs capitalize">{profile.role}</p>
              </div>
            </div>
            <div className="px-5">
              <ProfileField label="Full Name" value={profile.full_name} />
              <ProfileField label="Email" value={profile.email} />
              <ProfileField label="Role" value={profile.role} />
              <ProfileField label="Status" value={profile.status} />
              {profile.student_info && (
                <>
                  <ProfileField label="Student ID" value={profile.student_info.student_id} />
                  <ProfileField label="Grade" value={profile.student_info.grade} />
                  <ProfileField label="Class" value={profile.student_info.class} />
                  <ProfileField label="Phone" value={profile.student_info.phone} />
                </>
              )}
              {profile.teacher_info && (
                <>
                  <ProfileField label="Teacher ID" value={profile.teacher_info.teacher_id} />
                  <ProfileField label="Subject" value={profile.teacher_info.subject} />
                  <ProfileField label="Phone" value={profile.teacher_info.phone} />
                </>
              )}
              <ProfileField label="Member Since" value={profile.created_at ? new Date(profile.created_at).toLocaleDateString() : undefined} />
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
