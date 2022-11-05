import React from "react";
import styled from "styled-components";
import AddButton from "../ui/AddButton";
import DeleteButton from "../ui/DeleteButton";
import type { SearchEngineForm } from "../../schema";

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
    flex-grow: 0;
    min-width: 10%;
    max-width: 10%;
  }

  &:nth-child(2) {
    flex-grow: 2;
  }

  &:nth-child(3) {
    flex-grow: 0;
    flex-shrink: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
`;

interface Props {
  value: SearchEngineForm;
  onChange: (value: SearchEngineForm) => void;
  onBlur: () => void;
}

class Component extends React.Component<Props> {
  public static defaultProps: Props = {
    value: { default: "", engines: [] },
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    const value = this.props.value;
    return (
      <>
        <Grid role="list">
          <GridHeader>
            <GridCell>Name</GridCell>
            <GridCell>URL</GridCell>
            <GridCell>Default</GridCell>
          </GridHeader>
          {value.engines.map(({ name, url }, index) => {
            return (
              <GridRow key={index} role="listitem">
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="name"
                    aria-label="Name"
                    value={name}
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="url"
                    aria-label="URL"
                    placeholder="http://example.com/?q={}"
                    value={url}
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <input
                    data-index={index}
                    type="radio"
                    name="default"
                    aria-label="Default"
                    checked={value.default === name}
                    onChange={this.bindValue.bind(this)}
                  />
                  a
                  <DeleteButton
                    data-index={index}
                    aria-label="Delete"
                    name="delete"
                    onClick={this.bindValue.bind(this)}
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

  // eslint-disable-next-line max-statements
  bindValue(e: any) {
    const value = this.props.value;
    const name = e.target.name;
    const index = Number(e.target.getAttribute("data-index"));
    const next: typeof value = {
      default: value.default,
      engines: value.engines.slice(),
    };

    if (name === "name") {
      next.engines[index].name = e.target.value;
      next.default = value.engines[index].name;
    } else if (name === "url") {
      next.engines[index].url = e.target.value;
    } else if (name === "default") {
      next.default = value.engines[index].name;
    } else if (name === "add") {
      next.engines.push({ name: "", url: "" });
    } else if (name === "delete" && value.engines.length > 1) {
      next.engines.splice(index, 1);
      if (value.engines[index].name === value.default) {
        const nextIndex = Math.min(index, next.engines.length - 1);
        next.default = next.engines[nextIndex].name;
      }
    }

    this.props.onChange(next);
    if (name === "delete" || name === "default") {
      this.props.onBlur();
    }
  }
}

export default Component;
