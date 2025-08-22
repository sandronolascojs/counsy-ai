import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import type { InputProps, XStackProps } from 'tamagui';
import { Input, XStack, getTokenValue } from 'tamagui';

interface FormInputProps extends InputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  containerProps?: XStackProps;
}

export const FormInput = forwardRef<typeof Input, FormInputProps>(
  ({ icon, containerProps, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const accentColor = getTokenValue('$accentColor');

    return (
      <XStack
        items="center"
        borderWidth={1}
        borderRadius="$4"
        background="$background"
        borderColor={isFocused ? '$accentColor' : '$borderColor'}
        px="$3"
        {...containerProps}
      >
        {icon && (
          <XStack pr="$2">
            <Ionicons name={icon} size={18} color={isFocused ? accentColor : 'gray'} />
          </XStack>
        )}
        <Input
          ref={ref}
          flex={1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </XStack>
    );
  },
);
