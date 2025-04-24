import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { UserLogin } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: UserLogin) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);
      await login(data.username, data.password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid username or password. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LogIn className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Log in to your account
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loginError && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-4">
              {loginError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                id="username"
                label="Username"
                autoComplete="username"
                {...register('username', { required: 'Username is required' })}
                error={errors.username?.message}
              />
            </div>

            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
                error={errors.password?.message}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                Log in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;