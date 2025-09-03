import { supabase, type Profile } from './supabase'

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'email'>>
) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { profile, error }
}

export async function updateUserAvatar(userId: string, file: File) {
  // Upload avatar image
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    return { error: uploadError }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  // Update profile with new avatar URL
  const { data: profile, error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)
    .select()
    .single()

  return { profile, error: updateError }
}

export async function getNotificationPreferences(userId: string) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { preferences: data, error }
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    email_notifications: boolean
    web_notifications: boolean
    notification_types: string[]
  }
) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
    })
    .select()
    .single()

  return { preferences: data, error }
}
