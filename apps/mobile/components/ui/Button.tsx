import React from 'react';
import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps } from 'tamagui';

export type ButtonVariant = 'default' | 'ghost' | 'outline';

export interface ButtonProps extends Omit<TamaguiButtonProps, 'variant'> {
  variant?: ButtonVariant;
}

export const Button = ({
  children,
  variant = 'default',
  pressStyle: userPressStyle,
  hoverStyle: userHoverStyle,
  disabledStyle: userDisabledStyle,
  size: userSize,
  scaleIcon: userScaleIcon,
  ...restProps
}: ButtonProps) => {
  let variantProps: Partial<TamaguiButtonProps> = {
    fontWeight: '600',
  };

  switch (variant) {
    case 'ghost':
      variantProps = {
        ...variantProps,
        bg: 'transparent',
        borderWidth: 0,
        color: '$color',
        px: '$2',
        animation: undefined,
      };
      break;
    case 'outline':
      variantProps = {
        ...variantProps,
        bg: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        color: '$color',
      };
      break;
    case 'default':
    default:
      variantProps = {
        ...variantProps,
        theme: 'accent',
        gap: '$0.25',
        animation: 'bouncy',
      };
      break;
  }

  return (
    <TamaguiButton
      {...variantProps}
      {...restProps}
      pressStyle={{
        // Avoid scale on ghost to keep it subtle and crisp
        scale: variant === 'ghost' ? 1 : 0.97,
        opacity: variant === 'ghost' ? 0.6 : undefined,
        ...(variantProps.pressStyle || {}),
        ...(userPressStyle || {}),
      }}
      hoverStyle={{
        opacity: 0.8,
        ...(variantProps.hoverStyle || {}),
        ...(userHoverStyle || {}),
      }}
      size={userSize ?? '$4'}
      scaleIcon={userScaleIcon ?? 1}
      disabled={restProps.disabled}
      aria-disabled={restProps.disabled}
      aria-busy={restProps['aria-busy']}
      disabledStyle={{
        opacity: 0.5,
        ...(variantProps.disabledStyle || {}),
        ...(userDisabledStyle || {}),
      }}
    >
      {children}
    </TamaguiButton>
  );
};
