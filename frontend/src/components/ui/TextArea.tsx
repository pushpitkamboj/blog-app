import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm
          focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
          text-gray-900 placeholder:text-gray-400
          disabled:opacity-50 disabled:bg-gray-100
          ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-error-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;