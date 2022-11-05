import SettingRepository from "../../repositories/SettingRepository";

export default class AbstractScrollOperator {
  constructor(private readonly settingRepository: SettingRepository) {}

  protected getSmoothScroll(): boolean {
    const { smoothscroll } = this.settingRepository.getProperties();
    return smoothscroll as boolean;
  }
}
