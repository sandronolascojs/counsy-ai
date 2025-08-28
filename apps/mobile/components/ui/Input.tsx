import { Input as TamaguiInput, InputProps as TamaguiInputProps } from 'tamagui';

export const Input = (props: TamaguiInputProps) => {
  return (
    <TamaguiInput
      flex={1}
      items="center"
      borderWidth={1}
      rounded="$4"
      background="$background"
      borderColor="$borderColor"
      focusStyle={{
        borderColor: '$accentColor',
        outlineOffset: 4,
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: '$accentColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: '$accentColor',
        animation: 'fast-in',
      }}
      {...props}
    />
  );
};
