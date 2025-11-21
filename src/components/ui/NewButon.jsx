import { cn } from "@/lib/utils";

const variantStyles = {
  primary: 'bg-green text-white hover:bg-dark-green',
  secondary: 'bg-gray text-black hover:bg-gray-disabled',
  outline: 'border border-gray text-green hover:bg-gray',
};

const sizeStyles = {
  sm: 'px-[15px] py-[8px] text-[14px]',
  md: 'px-[20px] py-[12px] text-[16px]',
  lg: 'px-[30px] py-[15px] text-[18px]',
};

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  ...props
}) => {
  return (
    <button
      className={cn(
        'rounded-[10px] font-normal leading-[22px] transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}; 