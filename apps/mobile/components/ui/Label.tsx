import { Label as TamaguiLabel, LabelProps as TamaguiLabelProps } from 'tamagui';

export const Label = ({ children, ...props }: TamaguiLabelProps) => {
  return (
    <TamaguiLabel fontWeight="400" color="$color" {...props}>
      {children}
    </TamaguiLabel>
  );
};
