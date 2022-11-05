import React from "react";
import styled from "styled-components";
import AddButton from "../ui/AddButton";
import DeleteButton from "../ui/DeleteButton";
import type { FullBlacklistForm } from "../../schema";

const Grid = styled.div``;

const GridRow = styled.div`
  display: flex;
`;

const GridCell = styled.div<{ grow?: number }>`
  &:nth-child(1) {
    flex-grow: 1;
  }
  &:nth-child(2) {
    flex-shrink: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
`;

interface Props {
  value: FullBlacklistForm;
  onChange: (value: FullBlacklistForm) => void;
  onBlur: () => void;
}

class Component extends React.Component<Props> {
  public static defaultProps: Props = {
    value: [],
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    return (
      <>
        <Grid role="list">
          {this.props.value.map((pattern, index) => {
            return (
              <GridRow role="listitem" key={index}>
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="url"
                    aria-label="URL"
                    value={pattern}
                    placeholder="example.com/mail/*"
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <DeleteButton
                    data-index={index}
                    name="delete"
                    onClick={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                    aria-label="Delete"
                  />
                </GridCell>
              </GridRow>
            );
          })}
        </Grid>
        <AddButton
          name="add"
          aria-label="Add"
          style={{ float: "right" }}
          onClick={this.bindValue.bind(this)}
        />
      </>
    );
  }

  bindValue(e: any) {
    const name = e.target.name;
    const index = e.target.getAttribute("data-index");
    const items = this.props.value;

    if (name === "url") {
      items[index] = e.target.value;
    } else if (name === "add") {
      items.push("");
    } else if (name === "delete") {
      items.splice(index, 1);
    }

    this.props.onChange(items);
    if (name === "delete") {
      this.props.onBlur();
    }
  }
}

export default Component;
