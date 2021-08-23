import { BaseComponent, Component } from "./../component.js";

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
}

// SectionContainer의 생성자 규격을 정의
// 따라서 생성자를 선언하면 SectionContainer를 사용할 수 있음.
type SectionContainerConstructor = {
  // 빈 생성자를 return 하지만 SectionContainer Type 이어야 함.
  new (): SectionContainer;
};

export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;
  constructor() {
    super(`<li class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    closeBtn.onclick = () => {
      // this closeListener가 있으면 this.closeListener()를 호출
      this.closeListener && this.closeListener();
    };
  }
  addChild(child: Component) {
    const container = this.element.querySelector(
      ".page-item__body"
    )! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListener(listener: OnCloseListener): void {
    this.closeListener = listener;
  }
}

// ex. DarkModeComponent처럼 다양한 컴포넌트를 만들 때도
// PageComponent처럼 외부에서 쓰고 싶은 생성자를
// 내부에서는 주어진 생성자를 이용해 오브젝트만 만들어서 쓰도록 할 수 있다.
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
  }

  addChild(section: Component) {
    // PageItemComponent만을 사용하는 item이 아니라
    // pageItemConstructor를 인자로 받아 광범위하게 사용하도록 변경
    // const item = new PageItemComponent();
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, "beforeend");
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
  }
}
