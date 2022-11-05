import React from "react";
import styled from "styled-components";
import AddButton from "../ui/AddButton";
import DeleteButton from "../ui/DeleteButton";
import type { PartialBlacklistForm } from "../../schema";

const Grid = styled.div``;

const GridHeader = styled.div`
  display: flex;
  font-weight: bold;
`;

const GridRow = styled.div`
  display: flex;
`;

const GridCell = styled.div<{ grow?: number }>`
  &:nth-child(1) {
    flex-grow: 5;
  }

  &:nth-child(2) {
    flex-shrink: 1;
    min-width: 20%;
    max-width: 20%;
  }

  &:nth-child(3) {
    flex-shrink: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
`;

interface Props {
  value: PartialBlacklistForm;
  onChange: (value: PartialBlacklistForm) => void;
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
          <GridHeader>
            <GridCell>URL</GridCell>
            <GridCell>Keys</GridCell>
          </GridHeader>
          {this.props.value.map((item, index) => {
            return (
              <GridRow key={index} role="listitem">
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="url"
                    aria-label="URL"
                    value={item.pattern}
                    placeholder="example.com/mail/*"
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="keys"
                    aria-label="Keys"
                    value={item.keys.join(",")}
                    placeholder="j,k,<C-d>,<C-u>"
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <DeleteButton
                    data-index={index}
                    name="delete"
                    aria-label="Delete"
                    onClick={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
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
      items[index].pattern = e.target.value;
    } else if (name === "keys") {
      items[index].keys = e.target.value.split(",");
    } else if (name === "add") {
      items.push({ pattern: "", keys: [] });
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
