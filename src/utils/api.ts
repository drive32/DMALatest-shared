import { getSupabaseClient } from '../lib/supabase';
import { STORAGE_BUCKETS } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


export async function uploadFile(bucket: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${bucket}/${fileName}`;

  try {
    console.log("bucket name :"+bucket);
    const sessionString = await AsyncStorage.getItem('supabase-session');

    if (!sessionString) throw new Error('Authentication required');
    
    const session = JSON.parse(sessionString);

    // Step 1: Upload the file
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`, // Replace with your session's access token
        'apikey': supabaseAnonKey,
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file // The file object
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.json();
      throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
    }

    // Step 2: Get the public URL
    const publicUrlResponse = await fetch(`${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`, {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'apikey': supabaseAnonKey
      }
    });

    if (!publicUrlResponse.ok) {
      const urlError = await publicUrlResponse.json();
      throw new Error(`Failed to get public URL: ${urlError.message || 'Unknown error'}`);
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
    return publicUrl;

  } catch (error) {
    console.error('Error handling file upload:', error);
    throw error;
  }
}

export async function deleteFile(bucket: string, filePath: string) {
  const supabase = await getSupabaseClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) throw error;
}