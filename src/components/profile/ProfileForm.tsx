import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Loader2, User2, MapPin, Calendar, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProfileFormData {
  fullName: string;
  gender: 'male' | 'female' | 'other' | '';
  country: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  bio: string;
}

interface ProfileFormProps {
  userId: string;
  initialData?: ProfileFormData;
}

export function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const { updateProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: initialData || {
      fullName: '',
      gender: '',
      country: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      bio: ''
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      await updateProfile(userId, {
        fullName: data.fullName.trim(),
        gender: data.gender || null,
        country: data.country.trim(),
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber.trim(),
        address: data.address.trim(),
        bio: data.bio.trim()
      }, avatarFile);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-12"
      >
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-36 h-36 rounded-full bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-xl"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile Preview"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="text-accent-600 text-4xl font-bold">
                {initialData?.fullName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </motion.div>
          <label className="absolute bottom-2 right-2 p-3 bg-accent-600 rounded-full cursor-pointer hover:bg-accent-700 transition-all shadow-lg hover:shadow-xl hover:scale-110">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </motion.div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            <User2 className="w-4 h-4 inline-block mr-2 text-accent-600" />
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            {...register('fullName', { required: 'Full name is required' })}
            className={`input-primary w-full transition-all focus:ring-2 focus:ring-accent-500 pl-10 disabled:opacity-50 ${
              errors.fullName ? 'border-red-500' : ''
            }`}
            placeholder="Enter your full name"
            aria-label="Full name"
            disabled={isSubmitting}
          />
          <User2 className="w-5 h-5 text-gray-400 absolute left-3 top-[38px]" />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            id="gender"
            {...register('gender')}
            className="input-primary w-full transition-all focus:ring-2 focus:ring-accent-500 pl-10"
            disabled={isSubmitting}
            aria-label="Select gender"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline-block mr-2 text-accent-600" />
            Country
          </label>
          <input
            type="text"
            id="country"
            {...register('country')}
            className="input-primary w-full transition-all focus:ring-2 focus:ring-accent-500 pl-10"
            disabled={isSubmitting}
            placeholder="Enter your country"
          />
          <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-[38px]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline-block mr-2 text-accent-600" />
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            {...register('dateOfBirth')}
            className="input-primary w-full transition-all focus:ring-2 focus:ring-accent-500 pl-10"
            disabled={isSubmitting}
            aria-label="Date of birth"
          />
          <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-[38px]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline-block mr-2 text-accent-600" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            {...register('phoneNumber')}
            className="input-primary w-full transition-all focus:ring-2 focus:ring-accent-500 pl-10"
            disabled={isSubmitting}
            placeholder="Enter your phone number"
            aria-label="Phone number"
          />
          <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-[38px]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline-block mr-2 text-accent-600" />
            Address
          </label>
          <input
            type="text"
            id="address"
            {...register('address')}
            className="input-primary w-full transition-all focus:ring-2 focus:ring-accent-500 pl-10"
            disabled={isSubmitting}
            placeholder="Enter your address"
            aria-label="Address"
          />
          <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-[38px]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-2 mt-4 relative"
        >
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline-block mr-2 text-accent-600" />
            Bio
          </label>
          <textarea
            id="bio"
            {...register('bio')}
            rows={4}
            className="input-primary w-full resize-none transition-all focus:ring-2 focus:ring-accent-500 pl-10 disabled:opacity-50"
            disabled={isSubmitting}
            placeholder="Tell us about yourself..."
            aria-label="Bio"
          />
          <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-[38px]" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-end mt-12"
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2 px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isSubmitting ? 'Updating profile...' : 'Update profile'}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Update in progress...
            </>
          ) : (
            'Update Profile'
          )}
        </button>
      </motion.div>
    </form>
  );
}