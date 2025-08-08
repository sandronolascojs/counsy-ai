import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps } from 'tamagui';

export type ButtonVariant = 'default' | 'ghost' | 'outline';

export interface ButtonProps extends Omit<TamaguiButtonProps, 'variant'> {
  variant?: ButtonVariant;
}

export const Button = ({ children, variant = 'default', ...props }: ButtonProps) => {
  let variantProps: TamaguiButtonProps = {};

  switch (variant) {
    case 'ghost':
      variantProps = {
        backgroundColor: 'transparent',
        borderWidth: '$0',
        color: '$color',
        ...props,
      };
      break;
    case 'outline':
      variantProps = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        color: '$color',
        ...props,
      };
      break;
    case 'default':
    default:
      variantProps = {
        fontWeight: '600',
        theme: 'accent',
        gap: '$0.25',
        animation: 'bouncy',
        ...props,
      };
      break;
  }

  return (
    <TamaguiButton
      pressStyle={{ scale: 0.97, ...(variantProps.pressStyle || {}) }}
      scaleIcon={1.2}
      hoverStyle={{ opacity: 0.8 }}
      size="$4"
      {...variantProps}
    >
      {children}
    </TamaguiButton>
  );
};
