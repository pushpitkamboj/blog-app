import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { UserSignup } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const Signup: React.FC = () => {
  const { signup, login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<UserSignup>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: UserSignup) => {
    try {
      setIsSubmitting(true);
      setSignupError(null);
      
      // Register the user
      await signup(data.username, data.email, data.password);
      
      // Automatically log in the user
      await login(data.username, data.password);
      
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: unknown) {
      console.error('Signup failed:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.status === 409) {
        setSignupError('Username or email already exists. Please try different credentials.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((error as any)?.message === 'Password must contain at least one digit') {
        setSignupError('Password must contain at least one digit. Please try again.');
      } else {
        setSignupError('Failed to create account. Please try again.');
      }
      toast.error('Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            log in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {signupError && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-4">
              {signupError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                id="username"
                label="Username"
                autoComplete="username"
                {...register('username', { 
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' }
                })}
                error={errors.username?.message}
              />
            </div>

            <div>
              <Input
                id="email"
                type="email"
                label="Email"
                autoComplete="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />
            </div>

            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                autoComplete="new-password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  pattern: {
                    value: /^(?=.*\d).+$/,
                    message: 'Password must contain at least one digit'
                  }
                })}
                error={errors.password?.message}
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters and contain at least one digit.
              </p>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                Create account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;