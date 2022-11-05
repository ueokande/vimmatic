import React from "react";
import styled from "styled-components";
import Text from "../ui/Text";
import keymaps from "../../keymaps";
import type { KeymapsForm } from "../../schema";

const Grid = styled.div`
  column-count: 3;
`;

const FieldGroup = styled.div`
  margin-top: 24px;

  &:first-of-type {
    margin-top: 24px;
  }
`;

interface Props {
  value: KeymapsForm;
  onChange: (e: KeymapsForm) => void;
  onBlur: () => void;
}

class Component extends React.Component<Props> {
  public static defaultProps: Props = {
    value: {},
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    const values = this.props.value;
    return (
      <Grid>
        {keymaps.fields.map((group, index) => {
          return (
            <FieldGroup key={index}>
              {group.map(([name, label]) => {
                const value = values[name] || "";
                return (
                  <Text
                    id={name}
                    name={name}
                    key={name}
                    label={label}
                    value={value}
                    onValueChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                );
              })}
            </FieldGroup>
          );
        })}
      </Grid>
    );
  }

  bindValue(name: string, value: string) {
    const newValue = {
      ...this.props.value,
      [name]: value,
    };
    this.props.onChange(newValue);
  }
}

export default Component;
