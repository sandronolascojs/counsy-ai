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
  size: userSize,
  scaleIcon: userScaleIcon,
  ...restProps
}: ButtonProps) => {
  let variantProps: Partial<TamaguiButtonProps> = {};

  switch (variant) {
    case 'ghost':
      variantProps = {
        background: 'transparent',
        borderWidth: '$0',
        color: '$color',
      };
      break;
    case 'outline':
      variantProps = {
        background: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        color: '$color',
      };
      break;
    case 'default':
    default:
      variantProps = {
        fontWeight: '600',
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
        scale: 0.97,
        ...(variantProps.pressStyle || {}),
        ...(userPressStyle || {}),
      }}
      hoverStyle={{
        opacity: 0.8,
        ...(variantProps.hoverStyle || {}),
        ...(userHoverStyle || {}),
      }}
      size={userSize ?? '$4'}
      scaleIcon={userScaleIcon ?? 1.2}
    >
      {children}
    </TamaguiButton>
  );
};
