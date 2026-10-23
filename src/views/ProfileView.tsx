import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import type { UserProfile } from '@/types/metodicah';
import { Check, LogOut } from 'lucide-react';
import { Button } from '@/components/ui';
import { ProfileAvatarCard } from '@/components/profile/ProfileAvatarCard';
import { ProfileFormFields } from '@/components/profile/ProfileFormFields';
import { ProfileFeedbackAlert } from '@/components/profile/ProfileFeedbackAlert';
import { profileFormSchema, type ProfileFormData } from '@/components/profile/profileSchema';
import { useSettingsStore, useAuthStore } from '@/stores';
import { useToast } from '@/hooks/useToast';

export interface ProfileViewProps {
  user?: UserProfile;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user: propUser,
  onUpdateUser: propOnUpdateUser
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const logout = useAuthStore(s => s.logout);
  const storeUser = useSettingsStore(s => s.currentUser);
  const storeUpdateUser = useSettingsStore(s => s.updateUserProfile);

  const user = propUser ?? storeUser;
  const onUpdateUser = propOnUpdateUser ?? storeUpdateUser;

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);
  const [isSaved, setIsSaved] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      specialty: user.specialty || '',
      location: user.location || '',
      bio: user.bio || ''
    }
  });

  const { handleSubmit, reset, watch, formState: { isSubmitting } } = methods;

  useEffect(() => {
    reset({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      specialty: user.specialty || '',
      location: user.location || '',
      bio: user.bio || ''
    });
    setAvatarUrl(user.avatarUrl);
  }, [user, reset]);

  const watchedName = watch('name');
  const watchedSpecialty = watch('specialty');

  const onValidSubmit = (data: ProfileFormData) => {
    const updatedProfile: UserProfile = {
      ...user,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      specialty: data.specialty?.trim() || undefined,
      location: data.location?.trim() || undefined,
      bio: data.bio?.trim() || undefined,
      avatarUrl
    };

    onUpdateUser(updatedProfile);
    setIsSaved(true);
    toast.success('Perfil actualizado correctamente.');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    toast.info('Sesión cerrada correctamente.');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
          Mi Perfil de Usuario
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
          Administra tu información personal, cargo y preferencias de contacto dentro de METODICAH.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onValidSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile Card Header with Avatar and Role */}
          <ProfileAvatarCard
            name={watchedName || user.name}
            globalRole={user.globalRole}
            specialty={watchedSpecialty || user.specialty}
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
          />

          {/* Feedback Alert for errors or success */}
          <ProfileFeedbackAlert
            isSaved={isSaved}
            errorMsg={null}
          />

          {/* Form Fields: Personal & Professional Data */}
          <ProfileFormFields />

          {/* Actions: Logout & Save */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Button
              type="button"
              variant="danger"
              leftIcon={<LogOut size={16} />}
              onClick={handleLogout}
              style={{ fontSize: '0.84rem' }}
            >
              Cerrar Sesión
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Check size={16} />}
              style={{ fontSize: '0.84rem', padding: '10px 24px' }}
            >
              Guardar Cambios del Perfil
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
