import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { Input, NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { useState } from 'react';

export default {
  title: 'components/SelectAndTextInputContainer',
};

interface Item {
  label: string;
  value: string;
}

const items: Item[] = Array.from(
  { length: Math.floor(Math.random() * 30) },
  (_, i) => ({
    label: 'Item ' + i,
    value: 'item' + i,
  }),
);

export const Basic = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => items[0]);

  return (
    <SelectAndTextInputContainer>
      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
    </SelectAndTextInputContainer>
  );
};

export const Disabled = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => items[0]);

  return (
    <SelectAndTextInputContainer aria-disabled>
      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
    </SelectAndTextInputContainer>
  );
};
