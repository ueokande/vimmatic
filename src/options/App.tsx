import React from "react";
import styled from "styled-components";
import { useStorage } from "./hooks/storage";
import TextArea from "./components/TextArea";
import ErrorMessage from "./components/ErrorMessage";

const Container = styled.form`
  padding: 2px;
  font-family: system-ui;
`;

const App: React.FC = () => {
  const [currentValue, error, save] = useStorage();
  const [jsonText, setJson] = React.useState(currentValue);
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setJson(e.target.value);
    },
    [setJson]
  );
  const onBlur = React.useCallback(() => {
    save(jsonText);
  }, [jsonText, save]);

  return (
    <Container>
      <h1>Configure Vimmatic</h1>
      <p>
        See{" "}
        <a
          target="_blank"
          href="https://ueokande.github.io/vimmatic/"
          rel="noreferrer"
        >
          official document
        </a>{" "}
        for more details.
      </p>
      <div>
        <TextArea
          name="text"
          spellCheck={false}
          onChange={onChange}
          onBlur={onBlur}
          value={jsonText}
        />
        <ErrorMessage error={error} />
      </div>
    </Container>
  );
};

export default App;
