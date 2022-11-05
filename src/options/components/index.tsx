import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import TextArea from "./ui/TextArea";
import Radio from "./ui/Radio";
import SearchForm from "./form/SearchForm";
import KeymapsForm from "./form/KeymapsForm";
import FullBlacklistForm from "./form/FullBlacklistForm";
import PartialBlacklistForm from "./form/PartialBlacklistForm";
import * as settingActions from "../actions/setting";
import { State as AppState } from "../reducers/setting";
import {
  SettingsForm,
  KeymapsForm as KeymapsFormType,
  SearchEngineForm as SearchEngineFormType,
  FullBlacklistForm as FullBlacklistFormType,
  PartialBlacklistForm as PartialBlacklistFormType,
  PropertiesForm as PropertiesFormType,
  SettingsSource,
} from "../schema";

const Container = styled.form`
  padding: 2px;
  font-family: system-ui;
`;

const Fieldset = styled.fieldset`
  margin: 0;
  padding: 0;
  border: none;
  margin-top: 1rem;

  &:first-of-type {
    margin-top: 1rem;
  }
`;

const Legend = styled.legend`
  font-size: 1.5rem;
  padding: 0.5rem 0;
  font-weight: bold;
`;

const DO_YOU_WANT_TO_CONTINUE =
  "Some settings in JSON can be lost when migrating.  " +
  "Do you want to continue?";

type StateProps = ReturnType<typeof mapStateToProps>;
interface DispatchProps {
  dispatch: (action: any) => void;
}
type Props = StateProps &
  DispatchProps & {
    // FIXME
    store: any;
  };

class SettingsComponent extends React.Component<Props> {
  componentDidMount() {
    this.props.dispatch(settingActions.load());
  }

  renderFormFields(form: SettingsForm) {
    return (
      <div>
        <Fieldset>
          <Legend>Keybindings</Legend>
          <KeymapsForm
            value={form.keymaps}
            onChange={this.bindKeymapsForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </Fieldset>
        <Fieldset>
          <Legend>Search Engines</Legend>
          <SearchForm
            value={form.search}
            onChange={this.bindSearchForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </Fieldset>
        <Fieldset>
          <Legend>Blacklist</Legend>
          <FullBlacklistForm
            value={form.fullBlacklist}
            onChange={this.bindFullBlacklistForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </Fieldset>
        <Fieldset>
          <Legend>Partial blacklist</Legend>
          <PartialBlacklistForm
            value={form.partialBlacklist}
            onChange={this.bindPartialBlacklistForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </Fieldset>
        {
          // FIXME support properties in form settings
          /*
          <Fieldset>
            <Legend>Properties</Legend>
            <PropertiesForm
            types={Properties.types()}
            value={form.properties.toJSON()}
            onChange={this.bindPropertiesForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
          </Fieldset>
           */
        }
      </div>
    );
  }

  renderTextFields(text: string, error: string) {
    return (
      <div>
        <TextArea
          name="text"
          label="Plain JSON"
          spellCheck={false}
          error={error}
          onValueChange={this.bindText.bind(this)}
          onBlur={this.save.bind(this)}
          value={text}
        />
      </div>
    );
  }

  render() {
    let fields = null;
    const disabled = this.props.error.length > 0;
    if (this.props.source === "form") {
      fields = this.renderFormFields(this.props.form!);
    } else if (this.props.source === "text") {
      fields = this.renderTextFields(this.props.text!, this.props.error);
    }
    return (
      <Container>
        <h1>Configure Vimmatic</h1>
        <Radio
          id="setting-source-form"
          name="source"
          label="Use form"
          checked={this.props.source === "form"}
          value="form"
          onValueChange={this.bindSource.bind(this)}
          disabled={disabled}
        />

        <Radio
          name="source"
          label="Use plain JSON"
          checked={this.props.source === "text"}
          value="text"
          onValueChange={this.bindSource.bind(this)}
          disabled={disabled}
        />
        {fields}
      </Container>
    );
  }

  bindKeymapsForm(keymaps: KeymapsFormType) {
    const newValue = { keymaps, ...this.props.form };
    this.props.dispatch(settingActions.setForm(newValue));
  }

  bindSearchForm(search: SearchEngineFormType) {
    const newValue = { search, ...this.props.form };
    this.props.dispatch(settingActions.setForm(newValue));
  }

  bindFullBlacklistForm(fullBlacklist: FullBlacklistFormType) {
    const newValue = { fullBlacklist, ...this.props.form };
    this.props.dispatch(settingActions.setForm(newValue));
  }

  bindPartialBlacklistForm(partialBlacklist: PartialBlacklistFormType) {
    const newValue = { partialBlacklist, ...this.props.form };
    this.props.dispatch(settingActions.setForm(newValue));
  }

  bindPropertiesForm(properties: PropertiesFormType) {
    const newValue = { properties, ...this.props.form };
    this.props.dispatch(settingActions.setForm(newValue));
  }

  bindText(_name: string, text: string) {
    this.props.dispatch(settingActions.setText(text));
  }

  bindSource(_name: string, value: string) {
    const from = this.props.source;
    if (from === "form" && value === "text") {
      this.props.dispatch(settingActions.switchToText(this.props.form!));
      this.save();
    } else if (from === "text" && value === "form") {
      const b = window.confirm(DO_YOU_WANT_TO_CONTINUE);
      if (!b) {
        this.forceUpdate();
        return;
      }
      this.props.dispatch(settingActions.switchToForm(this.props.text!));
      this.save();
    }
  }

  save() {
    const { source, text, form } = this.props.store.getState();
    if (source === SettingsSource.Text) {
      this.props.dispatch(settingActions.saveText(text));
    } else {
      this.props.dispatch(settingActions.saveForm(form));
    }
  }
}

const mapStateToProps = (state: AppState) => ({ ...state });

export default connect(mapStateToProps)(SettingsComponent);
