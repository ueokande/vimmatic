import { provide } from "inversify-binding-decorators";

export interface FrameIdRepository {
  saveFrameId(frameId: number, target: Window, element: Element): void;

  getWindow(frameId: number): Window | undefined;

  getFrameElement(frameId: number): Element | undefined;
}

const targets: { [frameId: number]: Window } = {};
const elements: { [frameId: number]: Element } = {};

export const FrameIdRepository = Symbol("FrameIdRepository");

@provide(FrameIdRepository)
export class FrameIdRepositoryImpl implements FrameIdRepository {
  saveFrameId(frameId: number, target: Window, element: Element): void {
    targets[frameId] = target;
    elements[frameId] = element;
  }

  getWindow(frameId: number): Window | undefined {
    return targets[frameId];
  }

  getFrameElement(frameId: number): Element | undefined {
    return elements[frameId];
  }
}
