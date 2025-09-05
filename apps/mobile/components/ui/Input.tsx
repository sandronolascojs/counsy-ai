import { Input as TamaguiInput, InputProps as TamaguiInputProps } from 'tamagui';

export interface InputProps extends TamaguiInputProps {
  'aria-invalid'?: boolean;
}

export const Input = (props: InputProps) => {
  return (
    <TamaguiInput
      id={props.id ?? undefined}
      flex={1}
      items="center"
      borderWidth={1}
      rounded="$4"
      bg="$background"
      borderColor="$borderColor"
      focusStyle={{
        borderColor: props['aria-invalid'] ? '$red9' : '$accentColor',
        outlineOffset: 4,
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: props['aria-invalid'] ? '$red9' : '$accentColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: props['aria-invalid'] ? '$red9' : '$accentColor',
        animation: 'fast-in',
      }}
      {...props}
    />
  );
};
