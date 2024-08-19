export interface CsPickerProps {
  label: string;
  items: { label: string; value: string }[];
  selectedValue: string | undefined;
  placeholder?: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  style?: object;
}
